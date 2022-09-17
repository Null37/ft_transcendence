import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rooms, RoomsDTO } from 'src/Entity/rooms.entity';
import { RoomUsers } from 'src/Entity/roomsUser.entity';
import * as bcrypt from 'bcrypt';



@Injectable()
export class RoomsService {
	constructor(
	@InjectRepository(Rooms)
	public readonly  rooms: Repository<Rooms>,
	@InjectRepository(RoomUsers)
	public readonly roomUser: Repository<RoomUsers>
	){}

	//* Creates a new room and returns it.
	async create(roomElem: RoomsDTO, userID: string): Promise<any>
	{
		let exist = await this.rooms.findBy({roomName: roomElem.roomName});
		if (exist.length)
			return "Chat room already exists";
		if (roomElem.password)
			roomElem.password = await bcrypt.hash(roomElem.password, 10);
		let tmp = this.rooms.create(roomElem);

		let usr = this.roomUser.create({
			userID: +userID,
			role: "mod",
			status: 0,
			roomName: tmp.roomName
		}) 
		
		this.roomUser.save(usr);
		// await this.rooms.save(tmp);
		return  (await this.rooms.save(tmp));
	}

	async addUserToRoom(userID: string, room_name: string, password: string): Promise<any>
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
			let usrexist = await this.roomUser.findOne({where: {userID: +userID, roomName: room_name}})
			
			// if (usrexist && usrexist.status == 1 && usrexist.duration && +usrexist.duration > Date.now())
			if (usrexist && usrexist.status == 2 && usrexist.duration && +usrexist.duration > Date.now())
				return "User is banned from this chat";
			
			console.log(usrexist)
			if (usrexist == null)
			{
				console.log("room's password ===> ", tmp.password, " user's password ===> ", password)
				//TODO: check if the password is correct here
				if (tmp.password)
				{
					if (!password)
						return "this room is protected";
					else if (password)
					{
						const test = await bcrypt.compare(password, tmp.password)
						if (test == false)
							return "Wrong password";
					}

				}
				console.log("user not found")
				let user = this.roomUser.create({userID: +userID, role:"user", status:0, roomName: room_name, duration: "0"})
				console.log("RoomUser ===> ", user)
				await this.roomUser.save(user)
				let res = await this.roomUser.find({where: {userID: +userID, roomName: room_name}})
				console.log(res)
				return res;
			}
			else
				return "User already joined";
		}
	}

	async leaveUserRoom(userID: string, room_name: string): Promise<any>
	{
		let usr = await this.roomUser.findOne({where: {roomName: room_name, userID: +userID}})
		if (usr)
		{
			await this.roomUser.remove(usr);
			let isempty = await this.roomUser.find({where: {roomName: room_name}})
			if (isempty.length == 0)
				await this.rooms.remove(await this.rooms.findOne({where: {roomName: room_name}}))
		}
	}

	//* Set/modify/delete room's password
	async changeRoompw(user: number, roomName: string, password: string): Promise<any>
	{
		// const salt = 10;

		let usr = await this.roomUser.findOne({where: {userID: user, roomName: roomName}})
		if (usr.role == "moderator")
		{
			let room = await this.rooms.findOne({where: {roomName: roomName}})
			room.password = await bcrypt.hash(password, 10);
			this.rooms.save(room)
		}
	}
	
	//*  
	async changeUserRole(user: number, roomName: string, target: number, role: string): Promise<any> //! Sus function (double check)
	{
		let usr = await this.roomUser.findOne({where: {userID: user, roomName: roomName}})
		if (usr.role == "admin" || usr.role == "moderator")
		{
			let usr2 = await this.roomUser.findOne({where: {roomName: roomName, userID: target}})
			if (role == "admin")
			{
				usr2.role = role;
			}
			this.roomUser.save(usr2)
		}
	}

	
	async getRoomsList(): Promise<any>
	{
		// let rooms = await ;
		return this.rooms.find();
	}

	async getUsersList(roomName: string): Promise<any>
	{
		// let rooms = await ;
		return this.roomUser.find({where: {roomName: roomName}});
	}

	async getUserRoomsList(userID: number): Promise<any>
	{
		return this.roomUser.find({where: {userID: userID}});
	}
	

	//* Replaced with changeroomPW (if pw == undefined or empty string then it's public)
	async changeRoomState(user: number, roomName: string, state: number): Promise<any>
	{
		let usr = await this.roomUser.findOne({where: {userID: user, roomName: roomName}})
		if (usr.role == "moderator")
		{
			let room = await this.rooms.findOne({where: {roomName: roomName}})
			room.state = state;
			this.rooms.save(room)
		}
	}

	async getuserOfRoom(userID: number, roomName: string): Promise<any>
	{
		return this.roomUser.find({where: {userID: userID, roomName: roomName}})
	}
	
	async debuggingLog()
	{
		let res = await this.rooms.find();
		let tmp = await this.roomUser.find()
		return {res, tmp};
	}
}
