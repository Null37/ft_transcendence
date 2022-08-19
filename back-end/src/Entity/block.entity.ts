import { Column, Entity, JoinColumn,  OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Users } from "./users.entity";


@Entity()
export class block_list
{
    @PrimaryGeneratedColumn()
    id: number
    
    @Column()
    user_id: number

    @OneToOne(() => Users)
    @JoinColumn()
    block_list: Users
}