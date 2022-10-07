import { BadRequestException, Controller, Get, Param, Request, UseGuards } from "@nestjs/common";
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
    const regex = new RegExp('^[0-9]+$'); // check for security
    if(regex.test(par_id.toString()) == false)
      throw new BadRequestException()
    let test_user = await this.friend_base.add_frined({user_id: req.user.sub, friend_id: par_id})
    let newdata = await this.friend_base.find_friends(req.user.sub)
    return newdata
  }

  @Get('remove/:row_id')
  async remove_friend(@Request() req, @Param('row_id') par_id)
  {

    const regex = new RegExp('^[0-9]+$'); // check for security
    if(regex.test(par_id.toString()) == false)
      throw new BadRequestException()
    // const target_user = await this.authService.get_user(req.user.name)

    // req.user.sub id of user and req.user.name login of user all data from token
    let test_user = await this.friend_base.remove_friend(par_id, req.user.sub);

   // let newdata = await this.friend_base.find_friends(req.user.sub)

  //  return newdata
  }

 
  @Get('find')
  async find_all(@Request() req) // find all friend from this user(me)
  {
    return await this.friend_base.find_friends(req.user.sub);

  }



}