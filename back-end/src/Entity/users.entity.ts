
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { Games } from "./games.entity"


@Entity()
export class Users
{
    @PrimaryGeneratedColumn()
    id: number

    @Column({nullable: true})
    username: string


    @Column()
    intra_login: string

    @Column()
    avatar: string

    @Column()
    status: string

    @Column({nullable : true, select: false})
    secret: string 

    @Column()
    two_factor_authentication: boolean = false


	@Column("text", { array: true, default: [], nullable: false })
	socket_savier: string[]

    @OneToMany(() => Games, games => games.player_one)
    // hosted: Games[];
    @OneToMany(() => Games, games => games.player_two)
    // joined: Games[];
    games: Games[];
}