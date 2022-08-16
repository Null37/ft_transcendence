import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { friend_dto } from "src/DTO/frined.dto";
import { friend } from "src/Entity/friend.entity";
import { Repository } from "typeorm";

@Injectable()
export class FriendService {
  constructor(
    @InjectRepository(friend)
    private readonly  friend_base: Repository<friend>
  ){}

  
  async find_friends(user_id: number) 
  {
    // need more test for this function
    let stat = await this.friend_base.find({where: {user_id: user_id, status: 'friend'}, relations: ['friend_id']})
    console.log(" from friend ",stat)
    return stat
  }

  add_frined(friend_dto: friend_dto )
  {
    console.log("data dto", friend_dto)
    const newfriend = this.friend_base.create(friend_dto)
    return this.friend_base.save(newfriend)
  }

  // async block_frind(block_dto: block_dto)
  // {
  //   try
  //   {
  //     const newfriend = await this.friend_base.preload(block_dto);
  //     console.log("no error")
  //     console.log(newfriend)
  //     if(newfriend == undefined)
  //         return null;
  //     else
  //       return this.friend_base.save(newfriend);
  //   }
  //   catch
  //   {
  //     // if id not found the perload throw
  //     // if(newfriend == null)
  //       throw new UnauthorizedException()
  //   }
  // }
  
}