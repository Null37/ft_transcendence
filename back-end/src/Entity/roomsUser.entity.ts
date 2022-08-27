import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm"
import { Rooms } from "./rooms.entity"

export class RoomUserDTO
{
    roomName: string
	role: string
	userID: number
	status: number
	duration: number
	socketsNumber: number
}

@Entity()
export class RoomUsers
{

	@PrimaryGeneratedColumn()
	id: number

	@Column()
    roomName: string

	@Column()
	userID: number;

	@Column()
	role: string

	@Column({nullable: true})
	socketsNumber: number

	// @OneToOne(() => Rooms, {cascade: true})
	// @JoinColumn()
	// rooms: Rooms

	@Column({
		default: "0"
	})
	duration: string

	@Column()
	status: number
	/*
		status: 0 ==>  normal
		status: 1 ==>  muted
		status: 2 ==>  banned
	*/
}