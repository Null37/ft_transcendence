import { Injectable } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rooms, RoomsDTO } from 'src/Entity/rooms.entity';
import { RoomUserDTO, RoomUsers } from 'src/Entity/roomsUser.entity';



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

	async create(roomElem: RoomsDTO, userID: string)
	{
		let exist = await this.rooms.findBy({roomName: roomElem.roomName});
		if (exist.length)
		{
			// room already exists
			console.log("Chat room already exists")
			return null;
		}
		let tmp = this.rooms.create(roomElem);
		let usr = this.roomUser.create({
			id: Math.floor(Math.random() * 100),
			role: "moderator",
			status: 0

		})
		tmp.users = usr
		let res = await this.rooms.save(tmp);
		return  res;
	}

	async debuggingLog()
	{
		let res = await this.rooms.find({relations: ['users']});
		return res;
	}
}
