

export class update_dto
{
    id: number
    username?: string
    avatar? : string
    status? : string
    secret?: string 
    two_factor_authentication?: boolean = false
    socket_savier?
}