import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-42';
import { UsersService } from 'src/users/users.service';
import { jwtConstants } from '../constants';



@Injectable()
export class passport_42 extends PassportStrategy(Strategy) {
	constructor(private readonly usra: UsersService) {
    super({
		clientID: process.env.APIID, // process.env.APIID
		clientSecret: process.env.APISECRET, // process.env.APISECRET
		callbackURL: process.env.APIREDIRECT, // process.env.APIREDIRECT
    },
	async function verify(accessToken, refreshToken, profile, cb) 
	{
		var vr = await usra.findOne(profile.username);
		if(vr ==  null)
		{
			vr = await usra.create({ // nake name in future // for fornt-end check
				intra_login: profile.username,
				avatar: profile._json.image_url,
				status: "Offline",
				two_factor_authentication: false
			})
		}
		return cb(null, vr);
	});
  }

}