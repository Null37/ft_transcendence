import { Controller, Get, Param, Request, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth/auth.service";
import { jwtGuard } from "./auth/guards/jwt-auth.guard";
import { FriendService } from "./users/friend.service";

@Controller('friend')
@UseGuards(jwtGuard) // global guards
export class FrinedCtroller {
  constructor(private readonly friend_base: FriendService, private readonly authService: AuthService) {}


  @Get('add/:id')
  async add_friend(@Request() req, @Param('id') par_id)
  {
    console.log("start add friend ")
    console.log("test ==> par_id", par_id)
    console.log("test ==> user", req.user)
    console.log("test ==> id", req.user.sub)
    let test_user = await this.friend_base.add_frined({user_id: req.user.sub, friend_id: par_id})
    console.log("new data" ,test_user)
    let newdata = await this.friend_base.find_friends(req.user.sub)
    console.log("databse",newdata)
    return newdata
  }

  @Get('remove/:row_id')
  async remove_friend(@Request() req, @Param('row_id') par_id)
  {
    console.log("remove friend ")
    console.log("test ==> par_id", par_id)
    console.log("test ==> user", req.user)
    console.log("test ==> id", req.user.sub)
    // const target_user = await this.authService.get_user(req.user.name)
    // console.log("found user ==> ", target_user)

    let test_user = await this.friend_base.remove_friend(par_id);
    console.log(test_user);
   // let newdata = await this.friend_base.find_friends(req.user.sub)
    //console.log("databse",newdata)
  //  return newdata
  }

 
  @Get('find')
  async find_all(@Request() req) // find all friend from this user(me)
  {
    console.log(" find friend of user = ", req.user.sub)
    return await this.friend_base.find_friends(req.user.sub);

  }

  // @Get('block/:id')
  // async block_user(@Request() req, @Param('id') par_id)
  // {
  //   console.log("block this user", par_id)
  //   console.log("me  ==> ", req.user.name)
  //   let for_test = await this.friend_base.block_frind({user_id: req.user.sub, friend_id: par_id, status:  'blocked'})
  //   console.log("update ....", for_test)

  // }




}