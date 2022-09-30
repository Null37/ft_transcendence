import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-42';
import { UsersService } from 'src/users/users.service';
import { jwtConstants } from '../constants';



@Injectable()
export class passport_42 extends PassportStrategy(Strategy) {
	constructor(private readonly usra: UsersService) {
    super({
		clientID: '9a9063566068d7a986caea4ee8f8d7b91ed1fe0d5959ea278dc8cae5ea2eaa8a', // process.env.APIID
		clientSecret: 'b5cb5f8b755bb1354a629c7fcc94edbf0239db0d6b781ba12f83fc29fc8c7c5e', // process.env.APISECRET
		callbackURL: 'http://localhost:3000/login', // process.env.APIREDIRECT
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