import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BlockLIST } from "src/Entity/block.entity";
import { Repository } from "typeorm";
import { block_dto } from "src/DTO/block.dto";
import { FriendService } from "./friend.service";
import { UsersService } from "./users.service";

@Injectable()
export class blockService {
  constructor(
    @InjectRepository(BlockLIST)
    private readonly  block_base: Repository<BlockLIST>,
    private readonly friend_base: FriendService,
    private readonly userdata: UsersService
  ){}

    
  async get_blocked(user_id: number)
  {
    let stat = await this.block_base.find({where: {user_id: user_id}, relations: {block_list: true}})
    let res = new Array()
    stat.forEach(element => {
            res.push(element.block_list);
        });
    return res;
  }

  async find_blocked(me: number, friend_id: number)
  {
   const findrow  = await this.block_base.createQueryBuilder('block')
      .leftJoinAndSelect("block.block_list", "blocklist")
      .where("block.user_id = :userid", {userid: me})
      .andWhere("blocklist.id = :id", { id: friend_id })
      .getOne()
    return findrow;
  }
  async block(block_dto: block_dto, me: number, friend_id: number)
  {
    const user = await this.friend_base.remove_friend(friend_id, me)
    if(user == null)
      console.log("not frined")
      const findrow  = await this.block_base.createQueryBuilder('block')
      .leftJoinAndSelect("block.block_list", "blocklist")
      .where("block.user_id = :userid", {userid: me})
      .andWhere("blocklist.id = :id", { id: friend_id })
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
    .leftJoinAndSelect("block.block_list", "list")
    .where("block.user_id = :userid", {userid: me})
    .andWhere("list.id = :id", { id: block_id })
    .getOne()
    console.log("bruh id row ==>", findrow.id)
    const userfound = await this.block_base.findOneBy({id: findrow.id})
    if(userfound == null)
      return userfound
    let user_id = await this.block_base.remove(userfound);
    console.log("user_id ==> ", user_id);
    return await this.userdata.findbyId(block_id);
  }
  


}