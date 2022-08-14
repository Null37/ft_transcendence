import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, Unique } from "typeorm"


export class RoomUserDTO
{
	@Column()
	role: string

	@Column()
	status: number
	/*
		status: 0 ==>  normal
		status: 1 ==>  muted
		status: 2 ==>  banned
	*/
}

@Entity()
export class Users
{
	@PrimaryGeneratedColumn()
    id: number

	@Column()
	role: string

	@OneToOne(() => Rooms, (users) => users.users)
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

// =========================================================

export class RoomsDTO
{
	password: string;
	state: number;
}
@Entity()
export class Rooms
{
    @PrimaryGeneratedColumn()
    id: number

    @Column({nullable: true})
    password: string

	@OneToOne(() => Users, (rooms) => (rooms.rooms))
	@JoinColumn()
	users: Users

    @Column()
    state: number // or string
	/*
		state: 0 ==>  public
		state: 1 ==>  protected
		state: 2 ==>  private
	*/
}