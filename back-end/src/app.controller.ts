import { Controller, Get, Header, Logger, Post, Redirect, Request, Response, UseFilters, UseGuards } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { pass_42Guard } from './auth/guards/passport-42-auth.guard';
// import { Unauthorized } from './auth.filter'
import { response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly authService: AuthService) {}



  @UseGuards(pass_42Guard)
  @Get('login')
  //@UseFilters(Unauthorized)
  getProfile(@Request()  req, @Response() res) 
  {
    res.cookie("test", "lol")

    return res.redirect("http://localhost:8080/Community");
  }

  @Get('working')
  hoho(@Request() req, @Response() res )
  {

  	// return res.cookie("test", "lol").send()
  }
  @Get("login")
  hehe(): string
  {
	  return'fuckyou';
  }
}
