import { Injectable } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rooms, RoomsDTO } from 'src/Entity/rooms.entity';



@Injectable()
export class RoomsService {
	constructor(
	@InjectRepository(Rooms)
	private readonly  rooms: Repository<Rooms>
	){}

// async findOne(intra_login: string) 
// {

//      const test = await this.rooms.find();
//      if(!test)
//         console.log(test);
//     return test;
// }

	async create(roomElem: RoomsDTO)
	{
		let tmp = this.rooms.create(roomElem);
		if (true)
		return  this.rooms.save(tmp);
	}

	async debuggingLog(  )
	{
		console.log(await this.rooms.find());
	}
}
