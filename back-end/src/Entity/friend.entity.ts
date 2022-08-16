import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Users } from "./users.entity";


@Entity()
export class friend
{
    @PrimaryColumn()
    user_id: number

    @OneToOne(() => Users)
    @JoinColumn()
    friend_id: Users

    @Column()
    status: string // true if friend and false block

}