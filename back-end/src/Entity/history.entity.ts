import { Column, Entity, JoinColumn,  ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Users } from "./users.entity";


@Entity()
export class history
{
    @PrimaryGeneratedColumn()
    id: number
    
    @Column()
    user_id: number
    
    @Column()
    score: number

    @ManyToOne(() => Users)
    @JoinColumn()
    vs: Users

    @Column()
    status: string

    @Column({array: true})
    achievements: string

    @Column()
    level: number = 0;
}