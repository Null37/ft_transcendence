import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rooms, RoomsDTO } from 'src/Entity/rooms.entity';
import { RoomUsers } from 'src/Entity/roomsUser.entity';



@Injectable()
export class RoomsService {
	constructor(
	@InjectRepository(Rooms)
	private readonly  rooms: Repository<Rooms>,
	@InjectRepository(RoomUsers)
	public readonly roomUser: Repository<RoomUsers>
	){}

	//* Creates a new room and returns it.
	async create(roomElem: RoomsDTO, userID: string): Promise<any>
	{
		let exist = await this.rooms.findBy({roomName: roomElem.roomName});
		if (exist.length)
			return "Chat room already exists";

		let tmp = this.rooms.create(roomElem);

		let usr = this.roomUser.create({
			userID: +userID, //! should insert userID here
			role: "mod",
			status: 0,
			roomID: tmp.roomName
		}) 
		
		this.roomUser.save(usr);
		await this.rooms.save(tmp);
		return  usr;
	}

	async addUserToRoom(userID: string, room_name: string): Promise<any>
	{
		/* 
			1- Check if the room exists.
			2- Check if user already joined the room or not
			3- Check the state of the user (if he's banned from joining the room)
			4- If the room is protected by password, then check if the given password if correct
		*/
		let tmp = await this.rooms.findOne({where: {roomName: room_name}})
		if (tmp == null)
		{
			console.log("Room not found")
			return "Room not found";
		}
		else
		{
			console.log("Room already exists")
			let usrexist = this.roomUser.find({where: {userID: +userID}})
			if ((await usrexist).length == 0)
			{
				console.log("user not found")
				let user = this.roomUser.create({userID: +userID, role:"user", status:0, roomID: room_name})
				console.log("RoomUser ===> ", user)
				await this.roomUser.save(user)
				let res = await this.roomUser.find({where: {roomID: room_name}})
				console.log(res)
				return res;
			}
			else
			{
				let res = await this.roomUser.find({where: {roomID: room_name}})
				return res;
			}
		}
	}

	async leaveUserRoom(userID: string, room_name: string): Promise<any>
	{
		let usr = await this.roomUser.findOne({where: {roomID: room_name, userID: +userID}})
		if (usr)
		{
			await this.roomUser.remove(usr);
			let isempty = await this.roomUser.find({where: {roomID: room_name}})
			if (isempty.length == 0)
				await this.rooms.remove(await this.rooms.findOne({where: {roomName: room_name}}))
		}
	}

	async changeRoompw(user: number, roomID: string, password: string): Promise<any>
	{
		let usr = await this.roomUser.findOne({where: {userID: user, roomID: roomID}})
		if (usr.role == "admin" || usr.role == "moderator")
		{
			let room = await this.rooms.findOne({where: {roomName: roomID}})
			room.password = password;
			this.rooms.save(room)
		}
	}
	
	//*  
	async changeUserState(user: number, roomID, target: number, state: number): Promise<any> //! Sus function (double check)
	{
		let usr = await this.roomUser.findOne({where: {userID: user, roomID: roomID}})
		if (usr.role == "admin" || usr.role == "moderator")
		{
			let usr = await this.roomUser.findOne({where: {roomID: roomID, userID: target}})
			usr.status = state;
			this.roomUser.save(usr)
		}
	}

	
	async getRoomsList(): Promise<any>
	{
		// let rooms = await ;
		return this.rooms.find();
	}
	async getUsersList(roomID: string): Promise<any>
	{
		// let rooms = await ;
		return this.roomUser.find({where: {roomID: roomID}});
	}
	
	async changeRoomState(user: number, roomID: string, state: number): Promise<any>
	{
		let usr = await this.roomUser.findOne({where: {userID: user, roomID: roomID}})
		if (usr.role == "moderator")
		{
			let room = await this.rooms.findOne({where: {roomName: roomID}})
			room.state = state;
			this.rooms.save(room)
		}
		}

	async debuggingLog()
	{
		let res = await this.rooms.find();
		let tmp = await this.roomUser.find()
		return {res, tmp};
	}
}
