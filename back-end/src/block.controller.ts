import { Controller, Get, Param, Request, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth/auth.service";
import { jwtGuard } from "./auth/guards/jwt-auth.guard";
import { blockService } from "./users/block.service";

@Controller('block')
@UseGuards(jwtGuard) // global guards
export class BlockCtroller {
  constructor(private readonly block_base: blockService, private readonly authService: AuthService) {}



  @Get('find')
  async all_blocked(@Request() req)
  {
      return await this.block_base.get_blocked(req.user.sub); 
  }

  @Get(':id')
  async block_user(@Request() req, @Param('id') par_id)
  {
    
    await this.block_base.block({user_id: req.user.sub, block_list: par_id}, req.user.sub, par_id)
  }

  @Get('unblock/:id')
  async unblock_user(@Request() req, @Param('id') par_id)
  {
    return await this.block_base.unblock(par_id, req.user.sub);

  }

  
}