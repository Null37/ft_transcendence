import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, Unique } from "typeorm"
import { RoomUsers } from "./roomsUser.entity";

export class RoomsDTO
{
	roomName: string;
	password: string;
	state: number;
	// users: RoomUsers;
}
@Entity()
export class Rooms
{
    @PrimaryGeneratedColumn()
    id: number

    @Column({nullable: true})
    password: string

    @Column()
    roomName: string

    @Column()
    state: number // or string
	/*
		state: 0 ==>  public
		state: 1 ==>  protected
		state: 2 ==>  private
	*/
}