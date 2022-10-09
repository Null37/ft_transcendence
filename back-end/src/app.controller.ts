import { BadGatewayException, BadRequestException, Body, Controller, FileTypeValidator, Get, Header, HttpException, HttpStatus, Logger, NotFoundException, Param, ParseFilePipe, ParseUUIDPipe, Patch, Post, Put, Query, Redirect, Req, Request, Res, Response, UploadedFile, UseFilters, UseGuards, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { pass_42Guard } from './auth/guards/passport-42-auth.guard';
import { jwtGuard } from './auth/guards/jwt-auth.guard';
import * as path from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { body_dto } from './DTO/body.dto';
import { UsersService } from './users/users.service';
import { GamesService } from "./games/games.service";
import { Matches, matches, MATCHES } from 'class-validator';
import { filter } from './DTO/filter.dto';


@Controller()
export class AppController {
  constructor(private readonly authService: AuthService,
		private readonly gamesservice: GamesService,
    private readonly userdata: UsersService) {}

  @UseGuards(pass_42Guard)
  @Get('login')
  async login(@Request() req, @Response() res) 
  {
    if(req.user.two_factor_authentication == true)
    {
      // redirect to new 2fa without set token
       return res.redirect("http://"+process.env.HOSTIP+":"+8080+"/2FA?id=" + req.user.id)
    }
    else
    {
      
        const accessToken = this.authService.login(req.user)

        return res.redirect("http://"+process.env.HOSTIP+":"+8080+"/Game?token="+accessToken);
      }

  }
  @UseGuards(jwtGuard)
  @Get("QR")
  async send_Qr_code(@Request() req)
  {
    let user = await this.authService.get_user(req.user.name)
    if(user == null)
      throw new NotFoundException('user not found')
    var speakeasy = require("speakeasy");
    if(user.two_factor_authentication == false)
    {
      // start generate secret 
      var secret = speakeasy.generateSecret({name: "ft_transcendence (" + user.username +")"});
      await this.authService.update_info({id: user.id, secret: secret.base32})
      var QRcode = require('qrcode')
      const generateQR = async (text) => {
        try {
          return await QRcode.toDataURL(text)
        } catch (err) {
        }
      }
      return await generateQR(secret.otpauth_url)
    }
    else
    {
        return new NotFoundException()
    }
  }

  @Put('2FA/verify')
  async verfiy_2fa(@Body(new ValidationPipe()) bd: body_dto, @Response() res)
  {
    let user = await this.authService.get_se(bd.id)
    let findit = await this.userdata.findbyId(bd.id)
    if(user == null)
      throw  new NotFoundException("user not found");
    var speakeasy = require("speakeasy");
    var verified = speakeasy.totp.verify({ secret: user,
       encoding: 'base32',
       token: bd.number });

    if(verified == true && findit.two_factor_authentication == false)
    {
      // set token and redirct to game?token
      this.authService.update_info({id: bd.id, two_factor_authentication: true})
      return res.status(HttpStatus.OK).send()
    }
    if (verified == true && findit.two_factor_authentication == true)
    {
      const accessToken = this.authService.login(findit)
      return res.json({token: accessToken});
    }
    else
    {
      throw new BadRequestException("not valid")
    }
  }
  
  @UseGuards(jwtGuard)
  @Get('2FA/disable')
  async disable_2FA(@Request() req)
  {
    let user = await this.authService.get_user(req.user.name)
    if(user == null)
      throw new NotFoundException()
    this.authService.update_info({id: req.user.sub, two_factor_authentication: false})
  }

  @UseGuards(jwtGuard)
  @Get('verify')
  verify_user(@Response() res)
  {
      //check if user have true token
    return res.status(HttpStatus.OK).send()
  }

  @UseGuards(jwtGuard)
  @Get('users')
  async get_all_users() // get all users data
  {
    let users = await this.authService.get_all()
    return users
  }


  @UseGuards(jwtGuard)
  @Get('user/:id')
  async get_user(@Request() Req, @Param('id') par: string)
  {
    // check of parm
    // let pagePattern: RegExp  = new RegExp('[0-9][a-b]','g')
    const regex = new RegExp('^[a-zA-Z]+$'); // check for security

    if(regex.test(par) == false)
       throw new BadRequestException()
    if (par === 'me')
      par = Req.user.name;
    // find usr and get data
    let user = await this.authService.get_user(par);
    if(user !=  null)
      return user
    throw new NotFoundException('Not Found USER')
  }

  @UseGuards(jwtGuard)
  @Patch('update')
  async update_user(@Request() req , @Body() body)
  {
    const regex = new RegExp('^[a-zA-Z0-9]+$'); // check for security
    if(regex.test(body.username) == false)
      throw new BadRequestException()
    let uniq_test = null
    if(body.username != undefined)
      uniq_test = await this.authService.check_username(body.username) // check username with database
    if(uniq_test != null)
      throw new BadRequestException('USERNAME NOT UNIQ')   // 400  bad req
     await this.authService.update_info({id: req.user.sub, username: body.username,  status: body.status, avatar: body.avatar});
  }


  @UseGuards(jwtGuard)
  @Post('upload/image')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: 'src/public', // uoload location
      filename: (req, file, cp) => {
        // file.filename = req.user['name']
        //parse(file.originalname).name.replace('\/s/g', '')
        const fullpath: string =  file.originalname // full path of requset file
        const path_parse: path.ParsedPath = path.parse(fullpath)
        let file_name = req.user['name'] + "_" + Date.now();
        const extension: string = path_parse.ext.toLowerCase();
       if(extension == '.png' || extension == '.jpeg' ||  extension == '.jpg' || extension == '.bmp' || extension == '.ico')
          cp(null, `${file_name}${extension}`)
       else 
          cp(null, 'null')
      }
    })
  }))
  async update_avatar(@Request() req, @UploadedFile() file) 
  {
    if(file.filename == 'null')
      throw new BadGatewayException("not an image") // req 502
    let path_file = "http://" + process.env.HOSTIP + ":" + 3000 + "/public/" + file.filename
    this.authService.update_info({id: req.user.sub, avatar: path_file})
    return path_file;
  }



  @UseGuards(jwtGuard)
  @Get('verify_game/:id')
  async verify_game(@Param('id') gameId) // get information about a game
  {
    const regex = new RegExp('^[a-zA-Z0-9\-]+$'); // check for security
    if(regex.test(gameId) == false)
      throw new BadRequestException()
    // search for game using ID
    let game = null;

    try { game = await this.gamesservice.get_game(gameId); }
    catch (error) {  }

    return game;
  }

  @UseGuards(jwtGuard)
  @Get('invite_game/:id')
  async invite_game(@Param('id') userId) // get information about a game
  {
    // search for game using ID
    let game = null;
    const regex = new RegExp('^[0-9]+$'); // check for security
    if(regex.test(userId) == false)
      throw new BadRequestException()
    try {
      let findit = await this.userdata.findbyId(userId);
      game = await this.gamesservice.invite_game(findit);
    }
    catch (error) {  }

    return game;
  }

  @UseGuards(jwtGuard)
  @Get('accept_invite/:user/:game')
  async accept_invite(@Param('user') userid, @Param('game') gameid) // get information about a game
  {
    const regex = new RegExp('^[0-9]+$'); // check for security
    if(regex.test(userid.toString()) == false)
      throw new BadRequestException()
    const regex2 = new RegExp('^[a-zA-Z0-9\-]+$'); // uuid check for security 
    if(regex2.test(gameid) == false)
        throw new BadRequestException()
    try {
      let invited = await this.userdata.findbyId(userid);
      return this.gamesservice.accept_invite(invited, gameid);
    }
    catch (error) {  }
  }

  @UseGuards(jwtGuard)
  @Get('get_history/:id')
  async get_history(@Param('id') userid: number) // get information about a player with their game history
  {
    const regex = new RegExp('^[0-9]+$'); // check for security
    if(regex.test(userid.toString()) == false)
      throw new BadRequestException()
    return (await this.gamesservice.get_history(userid));
  }
  @UseGuards(jwtGuard)
  @Get('get_achievm/:id')
  async get_achiev(@Param('id') userid: number) // get information about a player with their game history
  {
    const regex = new RegExp('^[0-9]+$'); // check for security
    if(regex.test(userid.toString()) == false)
      throw new BadRequestException()
    return (await this.gamesservice.get_achievm(userid));
  }
  @UseGuards(jwtGuard)
  @Get('get_live_games')
  async get_live_games() // get information about active games
  {
    return await this.gamesservice.get_live_games();
  }
}
