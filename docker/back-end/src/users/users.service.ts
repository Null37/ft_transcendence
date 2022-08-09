import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/Entity/users.entity';
import { Repository } from 'typeorm';

// This should be a real class/interface representing a user entity

export class dto_test
{
  username: string

  intra_login: string

  avatart: string

  status: string

}


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly  usersdata: Repository<Users>
  ){}

async findOne(intra_login: string) 
{

     const test = await this.usersdata.findOneBy({intra_login});
    return test;
}

  create(users_id: dto_test) // dont forget to add real DTO
  {
      var test  = this.usersdata.create(users_id);
      return this.usersdata.save(test);
  }
}
