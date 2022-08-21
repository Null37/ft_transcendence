import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"


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
}