import { Controller, Get, Logger, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

@Controller()
export class AppController {
  constructor(private readonly authService: AuthService) {}



  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Get('working')
  hoho(@Request() req):string {
	return 'it is working'
  }
  @Get()
  hehe(): string
  {
	return'home';
  }
}
