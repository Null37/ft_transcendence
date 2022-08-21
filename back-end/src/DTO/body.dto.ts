import { IsInt } from 'class-validator';

export class body_dto
{
    @IsInt() // for to be an number
    id: number
    @IsInt() // for to be an number
    number: number
}