import { Controller, Get, Header, Logger, Post, Request, UseFilters, UseGuards } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { Unauthorized } from './auth.filter'

@Controller()
export class AppController {
  constructor(private readonly authService: AuthService) {}



  @UseGuards(JwtAuthGuard)
  @Get('profile')
  
  //@UseFilters(Unauthorized)
  getProfile(@Request() req) {
    return req.user;
  }

  @Get('working')
  hoho(@Request() req):string {
	return 'it is working'
  }
  @Get("login")
  hehe(): string
  {
	  return'fuckyou';
  }
}
