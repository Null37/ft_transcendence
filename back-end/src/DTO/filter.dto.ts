import { IsInt } from 'class-validator';

export class filter 
{
    @IsInt()
    id: number    
}