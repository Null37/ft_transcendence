import { Body, Controller, Get, Header, HttpException, HttpStatus, Logger, Param, Patch, Post, Req, Request, UseFilters, UseGuards } from '@nestjs/common';
import { jwtGuard } from 'src/auth/guards/jwt-auth.guard';
import { RoomsDTO } from 'src/Entity/rooms.entity';
import { RoomUserDTO } from 'src/Entity/roomsUser.entity';
import { RoomsService } from './rooms.service';
import * as bcrypt from 'bcrypt';
@Controller("rooms")
@UseGuards(jwtGuard)
export class RoomController {

	constructor(private readonly roomService: RoomsService){}

	@Get('debug')
	debug()
	{
		return this.roomService.debuggingLog();
	}

	@Post('test')
	async test(){
		console.log("ciphering test ====> begin")
		
		const password = "test123test"
		const salt = 10;

		const hash = await bcrypt.hash(password, salt);
		console.log(hash)
		const isMatch = await bcrypt.compare("test", hash);
		console.log("ciphering test ====> end")
		console.log(isMatch)
	}
	
	@Post('create')
	async createRoom(@Body() body, @Request() req): Promise<RoomsDTO> {

		// check if room already exists with that name
		let res = await this.roomService.create(body, req.user.sub);
		if (res == "Chat room already exists")
			throw new HttpException(res, HttpStatus.FORBIDDEN);
		return res;
  	}


	@Get('joinRoom/:id')
	async joinRoom(@Body() body, @Param() param, @Request() req): Promise<any>
	{
		console.log("room's id's: ",param.id)

		let res = await this.roomService.addUserToRoom(req.user.sub, param.id, body.password);
		
		console.log("res ===> ", res)
		
		if (typeof res == "string")
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
		this.roomService.changeRoompw(req.user.sub, body.roomName, body.password);
	}

	@Get('roomsList')
	async getRoomsList(): Promise<any>
	{
		return (await this.roomService.getRoomsList()).map(element => {
			element.password = undefined
			return element
		})
	}

	@Get('usersList')
	async getusersList(@Body() body): Promise<any>
	{
		return (await this.roomService.getUsersList(body.roomName))
	}

	@Get('findUserRooms')
	async findroom(@Request() req): Promise<void>
	{
		let res = await this.roomService.getUserRoomsList(req.user.sub);
		return res;
	}
}
