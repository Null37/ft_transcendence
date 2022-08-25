import { Controller, Get, Param, Request, UseGuards } from "@nestjs/common";
import { jwtGuard } from "./auth/guards/jwt-auth.guard";
import { historyervice } from "./users/history.service";

@Controller('hostory')
@UseGuards(jwtGuard) // global guards
export class historyCtroller {
  constructor(private readonly hisdata: historyervice) {}


    @Get(":id")
    async find_history(@Param('id') par_id)
    {
        return await this.hisdata.find_history(par_id);

    }
}