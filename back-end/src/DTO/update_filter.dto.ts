
import { MaxLength } from 'class-validator';

export class update_filter
{
   @MaxLength(8)
   username: string
avatar: string
status: string
}