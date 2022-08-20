import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { friend_dto } from "src/DTO/frined.dto";
import { friend } from "src/Entity/friend.entity";
import { Repository } from "typeorm";

@Injectable()
export class FriendService {
  constructor(
    @InjectRepository(friend)
    private readonly friend_base: Repository<friend>
  ){}

  
  async find_friends(user_id: number) 
  {
    let stat = await this.friend_base.find({where: {user_id: user_id}, relations: {friend_id: true}})
    let res = new Array()
    stat.forEach(element => {
            res.push(element.friend_id);
        });
        // var newres = [];
        // res.forEach(element => {
        //     if (!newres.includes(element)) {
        //       newres.push(element);
        //     }
        // });
      return res
  }
  async add_frined(friend_dto: friend_dto )
  {
    console.log("data dto", friend_dto)
    const findrow  = await this.friend_base.createQueryBuilder('friend')
    .leftJoinAndSelect("friend.friend_id", "friend_id")
    .where("friend.user_id = :userid", {userid: friend_dto.user_id})
    .andWhere("friend_id.id = :id", { id: friend_dto.friend_id })
    .getOne()
    if(findrow == null)
    {
      const newfriend = this.friend_base.create(friend_dto)
      return this.friend_base.save(newfriend)
    }
  }

  async remove_friend(friend_id: number, me: number)
  { 
    console.log("start remove");
    
    const findrow  = await this.friend_base.createQueryBuilder('friend')
    .leftJoinAndSelect("friend.friend_id", "friend_id")
    .where("friend.user_id = :userid", {userid: me})
    .andWhere("friend_id.id = :id", { id: friend_id })
    .getMany()
    console.log("many==> ", findrow)
    let remove = new Array()
     findrow.forEach(( async function (element) {
        const removed = await this.friend_base.find({where:{id: element.id}})
        await this.friend_base.remove(removed)

        }).bind(this));
    console.log("remove ==> ", remove)
    // console.log("bruh", findrow.friend_id)
    // console.log("bruh id row ==>", findrow.id)
    // const userfound = await this.friend_base.findOneBy({id: findrow.id})
    // if(userfound == null)
    //   return userfound
    // return this.friend_base.remove(userfound)
  }
  
  
}