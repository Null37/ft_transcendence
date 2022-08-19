import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { block_list } from "src/Entity/block.entity";
import { Repository } from "typeorm";

@Injectable()
export class blockService {
  constructor(
    @InjectRepository(block_list)
    private readonly  friend_base: Repository<block_list>
  ){}

  

}