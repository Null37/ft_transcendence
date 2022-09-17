import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-42';
import { UsersService } from 'src/users/users.service';
import { jwtConstants } from '../constants';



@Injectable()
export class passport_42 extends PassportStrategy(Strategy) {
	constructor(private readonly usra: UsersService) {
    super({
		clientSecret: jwtConstants.secret,
		clientID: '3f898cb71115b6afcb8219bbfc835014640317c0d8b46306fc6b69b869d988f1',
		callbackURL: 'http://localhost:3000/login',
    },
	async function verify(accessToken, refreshToken, profile, cb) 
	{
		var vr = await usra.findOne(profile.username);
		console.log(vr);
		if(vr ==  null)
		{
			console.log("not found new user -- start create ----");
			vr = await usra.create({ // nake name in future // for fornt-end check
				intra_login: profile.username,
				avatar: profile._json.image_url,
				status: "Offline",
				two_factor_authentication: false
			})
			console.log(vr)
		}
		return cb(null, vr);
	});
  }

}