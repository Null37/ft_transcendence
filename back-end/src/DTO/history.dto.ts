import { Users } from "src/Entity/users.entity"


export class history_dto
{
   id?: number
   user_id: number
   vs: Users
   status?: string
   achievements?:string
   level?:number
}
