import { Controller, Get, Header, HttpStatus, Logger, Post, Redirect, Request, Response, UseFilters, UseGuards } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { pass_42Guard } from './auth/guards/passport-42-auth.guard';
// import { Unauthorized } from './auth.filter'
import { response } from 'express';
import { Users } from './Entity/users.entity';
import { jwtGuard } from './auth/guards/jwt-auth.guard';
import { retryWhen } from 'rxjs';
import { FastifyRequest } from 'fastify';

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
}
