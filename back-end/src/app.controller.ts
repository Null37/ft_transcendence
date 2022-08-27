import { BadGatewayException, BadRequestException, Body, Controller, FileTypeValidator, Get, Header, HttpException, HttpStatus, Logger, NotFoundException, Param, ParseFilePipe, Patch, Post, Put, Query, Redirect, Req, Request, Res, Response, UploadedFile, UseFilters, UseGuards, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { pass_42Guard } from './auth/guards/passport-42-auth.guard';
import { jwtGuard } from './auth/guards/jwt-auth.guard';
import * as path from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { get, request } from 'http';
import { stringify } from 'querystring';
import { write } from 'fs';
import { body_dto } from './DTO/body.dto';
import { UsersService } from './users/users.service';


@Controller()
export class AppController {
  constructor(private readonly authService: AuthService,
    private readonly userdata: UsersService) {}

  @UseGuards(pass_42Guard)
  @Get('login')
  async login(@Request() req, @Response() res) 
  {
    console.log("==============================================")
    console.log("two ==> ", req.user.two_factor_authenticatio)
    if(req.user.two_factor_authentication == true)
    {
      console.log("id ===> " , req.user.id)
      // redirect to new 2fa without set token
       return res.redirect("http://localhost:8080/2FA?id=" + req.user.id)
    }
    else
    {
      
        const accessToken = this.authService.login(req.user)
        console.log(accessToken)
        console.log("username ==> ", req.user.username);
        console.log("false")
        return res.redirect("http://localhost:8080/Game?token="+accessToken);
      }
    console.log("==============================================")

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
          console.error(err)
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
    console.log("id , number", bd.id, bd.number)
    let user = await this.authService.get_se(bd.id)
    let findit = await this.userdata.findbyId(bd.id)
    if(user == null)
      throw  new NotFoundException("user not found");
    var speakeasy = require("speakeasy");
    var verified = speakeasy.totp.verify({ secret: user,
       encoding: 'base32',
       token: bd.number });
    console.log(bd);
    console.log("findit ===> ", findit)
    console.log("findit two ===> ", findit.two_factor_authentication)

    if(verified == true && findit.two_factor_authentication == false)
    {
      // set token and redirct to game?token
      this.authService.update_info({id: bd.id, two_factor_authentication: true})
      return res.status(HttpStatus.OK).send()
    }
    if (verified == true && findit.two_factor_authentication == true)
    {
      console.log("ana hna ")
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
    console.log("start find users") // check with front-end if is work
    let users = await this.authService.get_all()
    return users
  }


  @UseGuards(jwtGuard)
  @Get('user/:id')
  async get_user(@Request() Req, @Param('id') par)
  {
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
    console.log("check test ==> " , body.username)
    let uniq_test = null
    if(body.username != undefined)
      uniq_test = await this.authService.check_username(body.username) // check username with database
    console.log(uniq_test)
    if(uniq_test != null)
      throw new BadRequestException('USERNAME NOT UNIQ')   // 400  bad req
     this.authService.update_info({id: req.user.sub, username: body.username,  status: body.status, avatar: body.avatar});
  }


  @UseGuards(jwtGuard)
  @Post('upload/image')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: 'src/public', // uoload location
      filename: (req, file, cp) => {
        console.log("body ==> ", req.user)
        // file.filename = req.user['name']
        console.log('start save image file ==>', file.originalname)
        //parse(file.originalname).name.replace('\/s/g', '')
        const fullpath: string =  file.originalname // full path of requset file
        const path_parse: path.ParsedPath = path.parse(fullpath)
        let file_name = req.user['name']
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
    console.log("start upload file") 
    console.log(file);
    let path_file = "http://localhost:3000/public/" + file.filename
    this.authService.update_info({id: req.user.sub, avatar: path_file})
    return path_file;
  }


}
