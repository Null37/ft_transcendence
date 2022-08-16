import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm"
import { Rooms } from "./rooms.entity"

export class RoomUserDTO
{
    roomID: number
	role: string
	userID: number
	status: number
}

@Entity()
export class RoomUsers
{
	@PrimaryGeneratedColumn()
	id: number

	@PrimaryColumn()
    roomID: number

	@Column()
	userID: number;

	@Column()
	role: string

	@OneToOne(() => Rooms)
	@JoinColumn()
	rooms: Rooms

	@Column()
	status: number
	/*
		status: 0 ==>  normal
		status: 1 ==>  muted
		status: 2 ==>  banned
	*/
}