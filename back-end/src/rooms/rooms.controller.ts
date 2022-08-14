import { Body, Controller, Get, Header, Logger, Post, Request, UseFilters, UseGuards } from '@nestjs/common';
import { RoomsService } from './rooms.service';

@Controller("rooms")
export class RoomController {

	constructor(private readonly roomService: RoomsService){}

  @Post('create')
  async hoho(@Body() body): Promise<void> {
	await this.roomService.create(body);
	this.roomService.debuggingLog()
  }

}
