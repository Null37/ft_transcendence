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
            jwtFromRequest: ExtractJwt.fromExtractors([(request:Request) => {
                let data = request?.cookies["token"];
                console.log(data)
                if(data == undefined){
                    return null;
                }
                return data
            }])
        });
    }

    async validate(payload:any)
    {
        console.log("test1")
        if(payload === null)
        {
            // throw new UnauthorizedException();
        }
        console.log(payload)
        return {
            nakename: false
        }
    }
}