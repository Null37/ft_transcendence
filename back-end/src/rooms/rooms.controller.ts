import { Body, Controller, Get, Header, HttpException, HttpStatus, Logger, Patch, Post, Request, UseFilters, UseGuards } from '@nestjs/common';
import { RoomsDTO } from 'src/Entity/rooms.entity';
import { RoomUserDTO } from 'src/Entity/roomsUser.entity';
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
		let res = await this.roomService.create(body, body.userID);
		if (res == "Chat room already exists")
			throw new HttpException(res, HttpStatus.FORBIDDEN);
		return res;
  	}


	@Get('joinRoom')
	async joinRoom(@Body() body): Promise<any>
	{
		let res = await this.roomService.addUserToRoom(body.userID, body.room_name);

		if (res == "Room not found")
			throw new HttpException(res, HttpStatus.NOT_FOUND)
		else
			throw new HttpException(res, HttpStatus.OK)
	}

	@Post('leaveRoom')
	async leaveRoom(@Body() body): Promise<any>
	{
		this.roomService.leaveUserRoom(body.userID, body.room_name);
	}
	
	@Patch('changeRoompw')
	async changeRoompw(@Body() body): Promise<any>
	{
		this.roomService.changeRoompw(body.userID, body.roomID, body.password);
	}

	@Get('roomsList')
	async getRoomsList(): Promise<any>
	{
		return (await this.roomService.getRoomsList())
	}

	@Get('usersList')
	async getusersList(@Body() body): Promise<any>
	{
		return (await this.roomService.getUsersList(body.roomName))
	}

	@Get('findRoom')
	async findroom(@Body() body): Promise<void>
	{
		let res = await this.roomService.addUserToRoom(body.user_id, body.room_name);
		return res;
	}
}
