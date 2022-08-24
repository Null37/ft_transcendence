import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
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

async findOne(intra_log: string): Promise<Users | null> 
{
    const test = await this.usersdata.findOneBy( { intra_login: intra_log });
    console.log("value ===> ", test)
    return test;
}




async get_secret(id: number)
{
  let test = await this.usersdata.findOne({where :{id: id}, select: ['secret']})
  if(test == null)
    return null
  return test.secret
}

create(users_id: user_dto) // dont forget to add real DTO
{
    let newuser  = this.usersdata.create(users_id);
    return this.usersdata.save(newuser);
}



  findAll()
  {
    return  this.usersdata.find();
  }
  async find_username(username: string)
  {
    const test = await this.usersdata.findOneBy( { username: username });
    console.log("value ===> ", test)
    return test;
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
        throw new UnauthorizedException()
    }
      // console.log(newuser);
  }
}
