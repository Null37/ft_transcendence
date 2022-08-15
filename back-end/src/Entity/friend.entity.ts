import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Users } from "./users.entity";


@Entity()
export class friend
{
    @PrimaryGeneratedColumn()
    id: number

    user_id: string

    @OneToOne(() => Users)
    @JoinColumn()
    friend_id: Users

    @Column()
    status: boolean // true if friend and false block

}