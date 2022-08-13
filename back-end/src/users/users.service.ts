import { Injectable, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { InjectRepository } from '@nestjs/typeorm';
import { update_dto } from 'src/DTO/update.dto';
import { user_dto } from 'src/DTO/user.dto';
import { Users } from 'src/Entity/users.entity';
import { Repository } from 'typeorm';


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly  usersdata: Repository<Users>
  ){}

async findOne(username: string): Promise<Users | null> 
{
    const test = await this.usersdata.findOneBy({username});
    console.log("value ===> ", test)
    return test;
}

  create(users_id: user_dto) // dont forget to add real DTO
  {
      var test  = this.usersdata.create(users_id);
      return this.usersdata.save(test);
  }

  findAll()
  {
    return this.usersdata.find();
  }
  async update(dto_update: update_dto)
  {
    try
    {
      let newuser = await this.usersdata.preload(dto_update);
      console.log("no error")
      console.log(newuser)
      if(newuser == undefined)
          return null;
      else
        return this.usersdata.save(newuser);
    }
    catch
    {
      // if id not found the perload throw
      // if(newuser == null)
        console.log("id is necessary")
    }
      // console.log(newuser);
  }
}
