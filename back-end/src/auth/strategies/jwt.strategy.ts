import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { createVerify } from 'crypto';
import { Strategy } from 'passport-42';
import { json } from 'stream/consumers';
import { jwtConstants } from '../constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
		clientSecret: jwtConstants.secret,
		clientID: '3f898cb71115b6afcb8219bbfc835014640317c0d8b46306fc6b69b869d988f1',
		callbackURL: 'http://127.0.0.1:3000/profile',
    },
	function verify(accessToken, refreshToken, profile, cb) {
		console.log(accessToken);
		console.log(accessToken);
		return cb(null, profile)
	});
  }

  async validate(payload: any) {
    return { };
  }
}