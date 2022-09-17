import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Games } from "src/Entity/games.entity";
import { Users } from "src/Entity/users.entity";
import { Repository } from "typeorm";

@Injectable()
export class GamesService {

	constructor(
		@InjectRepository(Games)
		private readonly gamesdata: Repository<Games>
	){}

	async getAll(): Promise<Games[]> {

		return await this.gamesdata.find({
			relations: ["player_one", "player_two"],
		});
	}

	async startGame(host: Users, guest: Users) {

		return await this.gamesdata
				.createQueryBuilder()
				.insert()
				.values({player_one: host, player_two: guest, score_one: 0, score_two: 0, finished: 0})
				.returning('id')
				.execute();
	}

	get_game(id: string): Promise<Games | null> 
	{
		return this.gamesdata.findOne({ 
			where: { id: id },
			relations: ['player_one', 'player_two'],
		});
	}
}