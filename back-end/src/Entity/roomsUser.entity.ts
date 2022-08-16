import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm"
import { Rooms } from "./rooms.entity"

export class RoomUserDTO
{
    roomID: string
	role: string
	userID: number
	status: number
}

@Entity()
export class RoomUsers
{

	@PrimaryGeneratedColumn()
	id: number

	@Column()
    roomID: string

	@Column()
	userID: number;

	@Column()
	role: string

	// @OneToOne(() => Rooms, {cascade: true})
	// @JoinColumn()
	// rooms: Rooms

	@Column()
	status: number
	/*
		status: 0 ==>  normal
		status: 1 ==>  muted
		status: 2 ==>  banned
	*/
}