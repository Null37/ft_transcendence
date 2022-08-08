import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { userInfo } from 'os';
import { Strategy } from 'passport-42';
import { UsersService } from 'src/users/users.service';
import { jwtConstants } from '../constants';



@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(private readonly usra: UsersService) {
    super({
		clientSecret: jwtConstants.secret,
		clientID: '3f898cb71115b6afcb8219bbfc835014640317c0d8b46306fc6b69b869d988f1',
		callbackURL: 'http://127.0.0.1:3000/profile',
    },
	function verify(accessToken, refreshToken, profile, cb) 
	{
		// console.log(accessToken);
		// console.log(accessToken);
		// console.log(refreshToken);
		// console.log(profile.id);
		usra.findOne('bruh');
		return cb(null, profile)
	});
  }
}