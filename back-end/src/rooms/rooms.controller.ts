import { Body, Controller, Get, Header, Logger, Post, Request, UseFilters, UseGuards } from '@nestjs/common';
import { RoomsDTO } from 'src/Entity/rooms.entity';
import { RoomsService } from './rooms.service';

@Controller("rooms")
export class RoomController {

	constructor(private readonly roomService: RoomsService){}

	@Get('debug')
	debug()
	{
		return this.roomService.debuggingLog();
	}
	//   async createDM(@Body() body): Promise<void> {
		// 	await this.roomService.create(body);
// 	this.roomService.debuggingLog()
//   }
	@Post('create')
	async createRoom(@Body() body): Promise<RoomsDTO> {
		// check if room already exists with that name
	let res = await this.roomService.create(body, "10");
	return res;
  	}

	@Get('findRoom')
	async findroom(@Body() body): Promise<void>
	{
		let res = await this.roomService.addUserToRoom(body.user_id, body.room_name);
		return res;
	}
}
