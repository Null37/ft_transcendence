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
    let stat = await this.friend_base.find({where: {user_id: user_id, status: 'friend'}, relations: ['friend_id']})

    console.log(" from friend ",stat)
    return stat
  }

  async remove_friend(row_id: number)
  { 
    console.log("start remove");
    //  const userfound  = await this.friend_base.findOne({where: {id: row_id}})
    const userfound  = await this.friend_base.createQueryBuilder('friend').leftJoinAndSelect("friend.friend_id", "friend_id").where("friend_id.id = :id", { id: row_id }).getOne()
    userfound.friend_id
    console.log("|bruh", userfound.friend_id,"|")
    // return this.friend_base.remove(userfound)
  }

  add_frined(friend_dto: friend_dto )
  {
    console.log("data dto", friend_dto)
    const newfriend = this.friend_base.create(friend_dto)
    return this.friend_base.save(newfriend)
  }
  async find_blocked(user_id: number)
  {
    let stat = await this.friend_base.find({where: {user_id: user_id, status: 'blocked'}, relations: ['friend_id']})
    console.log(" from block ", stat)
    return stat
  }

  async block_frind(block_dto: friend_dto)
  {
    try
    {
      const newfriend = await this.friend_base.preload(block_dto);
      console.log("no error")
      console.log(newfriend)
      if(newfriend == undefined)
          return null;
      else
        return this.friend_base.save(newfriend);
    }
    catch
    {
      // if id not found the perload throw
      // if(newfriend == null)
        throw new UnauthorizedException()
    }
  }
  
}