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
	// private readonly  roomUser: Repository<RoomUsers>
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
		let res = await this.rooms.save(tmp);


		let usr = this.roomUser.create({
			userID: Math.floor(Math.random() * 100), // should insert userID here
			role: "moderator",
			status: 0,
			roomID: res.id
		})
		this.roomUser.save(usr)
		// tmp.users = usr
		// console.log("reached here")
		return  res;
	}

	async addUserToRoom(userID: string, room_name: string)
	{
		/* 
			1- Check if the room exists.
			2- 
		*/

		let tmp = await this.rooms.findOne({where: {roomName: room_name}})
		if (tmp)
		{
			console.log("found")
			console.log(tmp)
		}
		else
		{
			console.log("Room not found")
			console.log(tmp)
			return ;
		}
		let user = this.roomUser.create({userID: +userID, role:"user", status:0, roomID: tmp.id})
		let res = await this.roomUser.save(user)
		console.log(res)
	}

	async debuggingLog()
	{
		let res = await this.rooms.find();
		let tmp = await this.roomUser.find()
		return {res, tmp};
	}
}
