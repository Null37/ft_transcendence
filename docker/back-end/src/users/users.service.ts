import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/Entity/users.entity';
import { Repository } from 'typeorm';

// This should be a real class/interface representing a user entity

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly  usersdata: Repository<Users>
  ){}

async findOne(username: string) {
  
   const test = await this.usersdata.findOneBy({username});
  //  vat b = this.usersdata.find();
  
   return test;
  }
}