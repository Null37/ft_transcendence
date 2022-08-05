import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { createVerify } from 'crypto';
import { Strategy } from 'passport-42';
import { jwtConstants } from '../constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
		clientSecret: jwtConstants.secret,
		clientID: '3f898cb71115b6afcb8219bbfc835014640317c0d8b46306fc6b69b869d988f1',
		callbackURL: 'http://127.0.0.1:3000/profile',
    },
	function(accessToken, refreshToken, profile, cb) {
		console.log("PRINTING ACCESS TOKEN");
		Logger.log('info')
		console.log(accessToken);
		return cb(profile)
	});
  }

  async validate(payload: any) {
    return { };
  }
}


/* 

new FortyTwoStrategy({
    clientID: FORTYTWO_APP_ID,
    clientSecret: FORTYTWO_APP_SECRET,
    callbackURL: "http://127.0.0.1:3000/auth/42/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ fortytwoId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
);

new JwtStrategy(opts, function(jwt_payload, done) {
    User.findOne({id: jwt_payload.sub}, function(err, user) {
        if (err) {
            return done(err, false);
        }
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
            // or you could create a new account
        }
    });
});

*/