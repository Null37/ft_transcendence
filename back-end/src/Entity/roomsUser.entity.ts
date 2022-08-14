import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm"
import { Rooms } from "./rooms.entity"

export class RoomUserDTO
{
    id: number
	role: string
	status: number
	rooms: Rooms
}

@Entity()
export class RoomUsers
{
	// @PrimaryGeneratedColumn()
	@PrimaryColumn()
    id: number

	@Column()
	role: string

	@OneToOne(() => Rooms, (rooms) => rooms.users, {onDelete: 'CASCADE'})
	// @JoinColumn()
	rooms: Rooms

	@Column()
	status: number
	/*
		status: 0 ==>  normal
		status: 1 ==>  muted
		status: 2 ==>  banned
	*/
}