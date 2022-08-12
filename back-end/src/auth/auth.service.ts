import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { Users } from 'src/Entity/users.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService, private readonly jwt: JwtService
  ) {}

  login(userdata: Users){
	const payload = { name: userdata.intra_login, sub: userdata.id};


	return this.jwt.sign(payload)
  }
}
