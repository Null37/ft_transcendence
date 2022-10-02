import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { Users } from 'src/Entity/users.entity';
import { update_dto } from 'src/DTO/update.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userdata: UsersService, private readonly jwt: JwtService
  ) {}

  login(userdata: Users){
	const payload = { name: userdata.intra_login, sub: userdata.id};


	return this.jwt.sign(payload)
  }
  async get_se(id: number)
  {
     return await this.userdata.get_secret(id)
  }
  get_all()
  {
    return  this.userdata.findAll()
  }
  get_user(intra_log: string ): Promise<Users | null> 
  {
    return this.userdata.findOne(intra_log)
  }

  check_username(username: string)
  {
    return this.userdata.find_username(username) 
  }
  update_info(upd: update_dto)
  {
      let user =  this.userdata.update(upd)
      if(user == null)
        throw new NotFoundException('Not Found USER', 'USER NOT FOUND')
      return user;
  }
}
