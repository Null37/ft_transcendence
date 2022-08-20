import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { block_list } from "src/Entity/block.entity";
import { Repository } from "typeorm";
import { block_dto } from "src/DTO/block.dto";
import { FriendService } from "./friend.service";

@Injectable()
export class blockService {
  constructor(
    @InjectRepository(block_list)
    private readonly  block_base: Repository<block_list>,
    private readonly friend_base: FriendService
  ){}

    
  async get_blocked(user_id: number)
  {
    let stat = await this.block_base.find({where: {user_id: user_id}, relations: {block_list: true}})
    let res = new Array()
    stat.forEach(element => {
            res.push(element.block_list);
        });
    return stat;
  }

  async block(block_dto: block_dto, me: number, friend_id: number)
  {
    const user = await this.friend_base.remove_friend(friend_id, me)
    if(user == null)
      console.log("not frined")
      const findrow  = await this.block_base.createQueryBuilder('block')
      .leftJoinAndSelect("block_list.block_list", "blocklist")
      .where("block.user_id = :userid", {userid: me})
      .andWhere("block_list.id = :id", { id: friend_id })
      .getOne()
    if(findrow ==  null)
    {
      const newfriend = this.block_base.create(block_dto)
      return this.block_base.save(newfriend)
    }
  }

 async  unblock(block_id: number, me: number)
  {
    const findrow  = await this.block_base.createQueryBuilder('block')
    .leftJoinAndSelect("blcok.block_list", "list")
    .where("block.user_id = :userid", {userid: me})
    .andWhere("list.id = :id", { id: block_id })
    .getOne()
    console.log("bruh id row ==>", findrow.id)
    const userfound = await this.block_base.findOneBy({id: findrow.id})
    if(userfound == null)
      return userfound
    return this.block_base.remove(userfound)
  }
  


}