import { Strategy } from "passport-42"
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "./auth.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy)
{
	constructor(private authService: AuthService){
		super("3f898cb71115b6afcb8219bbfc835014640317c0d8b46306fc6b69b869d988f1", "bb66cf4a56ed9f84cad11d951e12d03bd196d3ea101193bbba87efbceefdb97a", "http://127.0.0.1:3000/profile");
	}
	async validate()
	{
		//!check if user is valide (https://docs.nestjs.com/security/authentication#implementing-passport-local)

	}
}