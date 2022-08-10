import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { cp } from 'fs';
import { userInfo } from 'os';
import { Strategy } from 'passport-42';
import { UsersService } from 'src/users/users.service';
import { jwtConstants } from '../constants';



@Injectable()
export class passport_42 extends PassportStrategy(Strategy) {
	constructor(private readonly usra: UsersService) {
    super({
		clientSecret: jwtConstants.secret,
		clientID: 'ef83b7d3fe620b89e5e1defe0d47a56f796f2e037454c8fab1533bd0f9676cac',
		callbackURL: 'http://localhost:3000/profile',
    },
	async function verify(accessToken, refreshToken, profile, cb) 
	{
		// console.log(accessToken);
		// console.log(accessToken);
		// console.log(refreshToken);
		// console.log(profile.id);
		// console.log(profile.username);
		var vr = await usra.findOne(profile.username);
		// console.log(vr);
		if(vr ==  null)
		{
			console.log("not found new user -- start create ----");
			var test_user = usra.create({
				username: null, // nake name in future
				intra_login: profile.username,
				avatart: profile._json.new_image_url,
				status: "login"
			})
		}
		// if  create token and set cookie 
		return cb(null, profile);
	});
  }
}