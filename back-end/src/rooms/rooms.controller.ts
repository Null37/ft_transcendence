import { Body, Controller, Get, Header, HttpException, HttpStatus, Logger, Patch, Post, Req, Request, UseFilters, UseGuards } from '@nestjs/common';
import { jwtGuard } from 'src/auth/guards/jwt-auth.guard';
import { RoomsDTO } from 'src/Entity/rooms.entity';
import { RoomUserDTO } from 'src/Entity/roomsUser.entity';
import { RoomsService } from './rooms.service';

@Controller("rooms")
@UseGuards(jwtGuard)
export class RoomController {

	constructor(private readonly roomService: RoomsService){}

	@Get('debug')
	debug()
	{
		return this.roomService.debuggingLog();
	}

	@Post('create')
	async createRoom(@Body() body, @Request() req): Promise<RoomsDTO> {

		// check if room already exists with that name
		let res = await this.roomService.create(body, req.user.sub);
		if (res == "Chat room already exists")
			throw new HttpException(res, HttpStatus.FORBIDDEN);
		return res;
  	}


	@Get('joinRoom')
	async joinRoom(@Body() body, @Request() req): Promise<any>
	{
		let res = await this.roomService.addUserToRoom(req.user.sub, body.room_name);

		if (res == "Room not found")
			throw new HttpException(res, HttpStatus.NOT_FOUND)
		else
			throw new HttpException(res, HttpStatus.OK)
	}

	@Post('leaveRoom')
	async leaveRoom(@Body() body, @Request() req): Promise<any>
	{
		this.roomService.leaveUserRoom(req.user.sub, body.room_name);
	}
	
	@Patch('changeRoompw')
	async changeRoompw(@Body() body, @Request() req): Promise<any>
	{
		this.roomService.changeRoompw(req.user.sub, body.roomID, body.password);
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
	async findroom(@Body() body, @Request() req): Promise<void>
	{
		let res = await this.roomService.addUserToRoom(req.user.sub, body.room_name);
		return res;
	}
}
