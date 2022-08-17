
import { Users } from "src/Entity/users.entity"


export class friend_dto
{
   user_id: number
   friend_id: Users
   status: string // 
}

// export class block_dto
// {
//    user_id: string
//    friend_id: Users
//    status: string = 'blocked'
// }