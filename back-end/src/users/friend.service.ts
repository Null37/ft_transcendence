import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { friend } from "src/Entity/friend.entity";
import { Repository } from "typeorm";

@Injectable()
export class FriendService {
  constructor(
    @InjectRepository(friend)
    private readonly  friend_base: Repository<friend>
  ){}

  
  find_friends(user: string) 
  {
    this.friend_base.find({where: {user_id: user, status: true}, relations: ['Users']})
  }
}