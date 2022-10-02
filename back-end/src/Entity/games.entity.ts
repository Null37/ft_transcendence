import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Users } from "./users.entity";

export class games_dto
{
	id: string
	player_one: Users;
	player_two: Users;
	score_one: number = 0;
	score_two: number = 0;
	finished: number = 0;
	type: number = 1;
	created_at: Date;
}

@Entity()
export class Games
{
	@PrimaryGeneratedColumn("uuid")
	id: string

	@ManyToOne(() => Users, player => player.games, {nullable: false})
	@JoinColumn()
	player_one: Users;

	@ManyToOne(() => Users, player => player.games, {nullable: true})
	@JoinColumn()
	player_two: Users;

	@Column()
	score_one: number = 0;

	@Column()
	score_two: number = 0;

	@Column({ default: 0 })
	finished: number = 0;

	@Column({ default: 1 })
	type: number;
	// 1 : normal game
	// 2 : speedy game

	@CreateDateColumn()
	created_at: Date;
}