import { Controller, Get, Param, Request, UseGuards } from "@nestjs/common";
import { jwtGuard } from "./auth/guards/jwt-auth.guard";
import { FriendService } from "./users/friend.service";

@Controller('ADD')
export class FrinedCtroller {
  constructor(private readonly friend_base: FriendService) {}



  @UseGuards(jwtGuard)
  @Get('friend/:id')
  async add_friend(@Request() req, @Param('id') par_id)
  {
    console.log("start add friend ")
    console.log("test ==> par_id", par_id)
    console.log("test ==> user", req.user)
    console.log("test ==> id", req.user.sub)
    let test_user = await this.friend_base.add_frined({user_id: req.user.sub, friend_id: par_id, status:  'friend'})
    console.log("new data" ,test_user)
    let newdata = await this.friend_base.find_friends(req.user.sub)
    console.log("databse",newdata)
    return newdata
  }

}