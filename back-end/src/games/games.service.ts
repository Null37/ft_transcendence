import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { exit } from "process";
import { identity } from "rxjs";
import { Games } from "src/Entity/games.entity";
import { Users } from "src/Entity/users.entity";
import { Repository } from "typeorm";

@Injectable()
export class GamesService {

	constructor(
		@InjectRepository(Games)
		private readonly gamesdata: Repository<Games>,
		@InjectRepository(Users)
		private readonly playersdata: Repository<Users>,
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

	async invite_game(host: Users)
	{
		return await this.gamesdata
				.createQueryBuilder()
				.insert()
				.values({player_one: host, player_two: null, score_one: 0, score_two: 0, finished: 0})
				.returning('id')
				.execute();
	}

	finish_game(id: string, left_score: number, right_score: number)
	{
		this.gamesdata
		.findOne({
			relations: ['player_one', 'player_two'],
			where: { id: id },
		}).then((gm) => {

			gm.finished = 1;
			gm.score_one = left_score;
			gm.score_two = right_score;

			// p one wins
			if (gm.score_one == 4) {
				gm.player_one.first_win = "http://localhost:3000/public/achievements/success.png";
			}

			// p two wins
			else if (gm.score_two == 4) {
				gm.player_two.first_win = "http://localhost:3000/public/achievements/success.png";
			}

			// if (gm.player_two)
			// 	exit();
			gm.player_one.conquer = "http://localhost:3000/public/achievements/conquer.png";
			gm.player_two.conquer = "http://localhost:3000/public/achievements/conquer.png";

			gm.player_one.level += 1;
			gm.player_two.level += 1;

			this.gamesdata.save(gm);
			this.playersdata.save(gm.player_one);
			this.playersdata.save(gm.player_two);
		});
	}

	get_history(id: number)
	{
		return this.gamesdata
		.createQueryBuilder('games')
		.leftJoinAndSelect("games.player_one", "player_one")
		.leftJoinAndSelect("games.player_two", "player_two")
		.where("games.player_two = :plo", { plo: id })
		.orWhere("games.player_two = :plt", { plt: id })
		.getMany();
	}

	accept_invite(invited: Users, gameid: string)
	{
		this.gamesdata
		.createQueryBuilder()
		.update(Games)
		.set({ player_two: invited })
		.where("id = :id", { id: gameid })
		.execute();
	}
}