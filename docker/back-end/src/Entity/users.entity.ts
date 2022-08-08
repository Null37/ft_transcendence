import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"


@Entity()
export class Users
{
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    username: string

    @Column()
    avatart: string

    @Column()
    status: string
}