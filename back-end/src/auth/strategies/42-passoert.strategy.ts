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
		clientID: 'ef83b7d3fe620b89e5e1defe0d47a56f796f2e037454c8fab1533bd0f9676cac',
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
			})
			console.log(vr)
		}
		return cb(null, vr);
	});
  }

}