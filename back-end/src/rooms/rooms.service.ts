import { Injectable } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rooms, RoomsDTO } from 'src/Entity/rooms.entity';
import { RoomUserDTO, RoomUsers } from 'src/Entity/roomsUser.entity';
import { Users } from 'src/Entity/users.entity';



@Injectable()
export class RoomsService {
	constructor(
	@InjectRepository(Rooms)
	private readonly  rooms: Repository<Rooms>,
	@InjectRepository(RoomUsers)
	private readonly roomUser: Repository<RoomUsers>
	){}

// async findOne(intra_login: string) 
// {

//      const test = await this.rooms.find();
//      if(!test)
//         console.log(test);
//     return test;
// }
	//* Creates a new room and returns it.
	async create(roomElem: RoomsDTO, userID: string)
	{
		let exist = await this.rooms.findBy({roomName: roomElem.roomName});
		if (exist.length)
		{
			console.log("Chat room already exists")
			return null;
		}
		let tmp = this.rooms.create(roomElem);
		// let res = await this.rooms.save(tmp);

		let usr = this.roomUser.create({
			userID: Math.floor(Math.random() * 100), //! should insert userID here
			role: "moderator",
			status: 0,
			roomID: tmp.roomName
		}) 
		// tmp.users = u sr;
		this.roomUser.save(usr);
		let res = await this.rooms.save(tmp);
		return  res;
	}

	async addUserToRoom(userID: string, room_name: string): Promise<any>
	{
		/* 
			1- Check if the room exists.
			2- Check if user already joined the room or not
			3- Check the state of the user (if he's banned from joining the room)
		*/

		let tmp = await this.rooms.findOne({where: {roomName: room_name}})
		if (tmp == null)
		{
			console.log("Room not found")
			console.log(tmp)
			return ;
		}
		else
		{
			console.log("Room already exists")
			let usrexist = this.roomUser.find({where: {userID: +userID}})
			if (usrexist == null)
			{
				console.log("user not found")
				let user = this.roomUser.create({userID: +userID, role:"user", status:0, roomID: room_name})
				console.log("RoomUser ===> ", user)
				await this.roomUser.save(user)
				let res = await this.roomUser.find({where: {roomID: room_name}})
				console.log(res)
			}
			else
			{
				console.log("found user")
				console.log(tmp)
				return ;
			}
		}
	}

	async debuggingLog()
	{
		let res = await this.rooms.find();
		let tmp = await this.roomUser.find()
		return {res, tmp};
	}
}
