import { Column, Entity, JoinColumn,  ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Users } from "./users.entity";


@Entity()
export class block_list
{
    @PrimaryGeneratedColumn()
    id: number
    
    @Column()
    user_id: number

    @ManyToOne(() => Users)
    @JoinColumn()
    block_list: Users
}