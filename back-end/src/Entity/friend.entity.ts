import { Column, Entity, JoinColumn,  ManyToOne,  OneToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Users } from "./users.entity";


@Entity()
export class friend
{
    @PrimaryGeneratedColumn()

    id: number

    @Column()
    user_id: number

    @ManyToOne(() => Users)
    @JoinColumn()
    friend_id: Users

}