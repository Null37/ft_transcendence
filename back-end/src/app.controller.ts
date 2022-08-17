import { BadGatewayException, BadRequestException, Body, Controller, FileTypeValidator, Get, Header, HttpException, HttpStatus, Logger, NotFoundException, Param, ParseFilePipe, Patch, Post, Query, Redirect, Req, Request, Res, Response, UploadedFile, UseFilters, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { pass_42Guard } from './auth/guards/passport-42-auth.guard';
import { jwtGuard } from './auth/guards/jwt-auth.guard';
import * as path from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { request } from 'http';
import { stringify } from 'querystring';


@Controller()
export class AppController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(pass_42Guard)
  @Get('login')
  async login(@Request() req, @Response() res) 
  {
  //  if(req.user.two_factor_authentication == false)
  //  {
        // rediret to otp
  //  }
  //  else
  //  {

  //  }
   
    const accessToken = this.authService.login(req.user)
    console.log("==============================================")
    console.log("first data ==> ", "<", req.user.two_factor_authentication, ">")
    console.log(accessToken)
    console.log("username ==> ", req.user.username);
    var speakeasy = require("speakeasy");
    var secret = speakeasy.generateSecret()
    const newdata = await this.authService.update_info({id: req.user.id, secret: secret.base32})
    console.log("updated database", newdata);
    console.log("secret is 2fa == > ", secret)
    console.log("==============================================")
    return res.redirect("http://localhost:8080/Game?token="+accessToken);
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
  get_all_users() // get all users data
  {
    console.log("start find users") // check with front-end if is work
    return this.authService.get_all()
  }


  @UseGuards(jwtGuard)
  @Get('user/:id')
  async get_user(@Request() Req, @Param('id') par)
  {
    if (par === 'me')
      par = Req.user.name;
    console.log("start get info about user")
    // find usr and get data
    console.log("user = ", par)
    let user = await this.authService.get_user(par);
    console.log("valuse userv = ", user)
    if(user !=  null)
      return user;
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
      destination: 'images', // uoload location
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
          cp(null, 'not image')
      }

    })
  }))
  async update_avatar(@Request() req, @UploadedFile() file) 
  {
    if(file.filename == 'not image')
      throw new BadGatewayException("not an image") // req 502
    console.log("start upload file") 
    console.log(file);
    let path_file = "/images/" + file.filename
    this.authService.update_info({id: req.user.sub, avatar: path_file})
    return path_file;
  }


}
