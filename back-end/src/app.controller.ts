import { BadRequestException, Body, Controller, Get, Header, HttpStatus, Logger, NotFoundException, Param, Patch, Post, Query, Redirect, Request, Res, Response, UseFilters, UseGuards } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { pass_42Guard } from './auth/guards/passport-42-auth.guard';
// import { Unauthorized } from './auth.filter'
import { response } from 'express';
import { Users } from './Entity/users.entity';
import { jwtGuard } from './auth/guards/jwt-auth.guard';
import { NotFoundError, retryWhen } from 'rxjs';
import { FastifyRequest } from 'fastify';
import path from 'path';

@Controller()
export class AppController {
  constructor(private readonly authService: AuthService) {}



  @UseGuards(pass_42Guard)
  @Get('login')
  //@UseFilters(Unauthorized)
  login(@Request() req, @Response() res) 
  {
    // var token:string
    // let profile = req.user
    const accessToken = this.authService.login(req.user)
    console.log(accessToken)
    res.cookie('token', accessToken, {
      //sameSite: 'strict',
      httpOnly: true,
      // withCredentials: true
    });
    return res.redirect("http://localhost:8080/Community");
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
  async get_user(@Param('id') par)
  {
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
  @Get('logout')
  log_out(@Request() req, @Response() res)
  {
      // remove token and set logout in status
      console.log("id is ", req.user.sub)
      this.authService.update_info({id: req.user.sub, status: "logout"})
      console.log("logout")
      this.authService.get_all()
      res.clearCookie('token').send(); // remove token from cookie

  }

  @Patch('update')
  update_user(@Body() body)
  {
    console.log("test 1")
    console.log("req body", body)
    console.log(" body value", body.username)
    this.authService.update_info(body);
  }
  

}
