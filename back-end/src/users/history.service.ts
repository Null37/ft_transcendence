import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { history_dto } from "src/DTO/history.dto";
import { history } from "src/Entity/history.entity";
import { Repository } from "typeorm";

@Injectable()
export class historyervice {
  constructor(
    @InjectRepository(history)
    private readonly  histdata: Repository<history>
  ){}


    async add_history(his: history_dto)
    {
        his.level = +1;
        if(his.status == "win")
            his.achievements[0] = "http://localhost:3000/public/achievements/success.png" // first win
        else
            his.achievements[1] = "http://localhost:3000/public/achievements/conquer.png" // first game
        console.log("level ==> ", his.level)
        const newfriend = this.histdata.create(his)
        return this.histdata.save(newfriend)
    }

    async find_history(user_id: number)
    {
        let his = await this.histdata.find({where: {user_id: user_id}, relations: {vs: true}})
      return his
    }


}