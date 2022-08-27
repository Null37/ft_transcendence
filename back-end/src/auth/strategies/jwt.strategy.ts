import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Request } from "express";
import { request } from "http";



@Injectable()
export class jwtStrategy extends PassportStrategy(Strategy)
{
    constructor(){
        super({
            ignoreExpiration: false,
            secretOrKey:"My random secret key never let others",
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        });
    }

    validate(payload:any)
    {
        if(payload === null)
            throw new UnauthorizedException();
        return payload
    }
}