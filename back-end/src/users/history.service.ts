import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { history } from "src/Entity/history.entity";
import { Repository } from "typeorm";

@Injectable()
export class historyervice {
  constructor(
    @InjectRepository(history)
    private readonly  histdata: Repository<history>
  ){}


    

}