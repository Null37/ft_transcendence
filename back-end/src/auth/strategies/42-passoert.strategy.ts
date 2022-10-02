import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-42';
import { UsersService } from 'src/users/users.service';
import { jwtConstants } from '../constants';



@Injectable()
export class passport_42 extends PassportStrategy(Strategy) {
	constructor(private readonly usra: UsersService) {
    super({
		clientID: 'ef83b7d3fe620b89e5e1defe0d47a56f796f2e037454c8fab1533bd0f9676cac', // process.env.APIID
		clientSecret: '4534cfdc61bf96c6b7208c5e093a3bee94da4aacbe7f117afdd92f2f4e242163', // process.env.APISECRET
		callbackURL: 'http://localhost:3000/login', // process.env.APIREDIRECT
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