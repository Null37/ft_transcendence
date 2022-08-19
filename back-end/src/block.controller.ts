import { Controller, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth/auth.service";
import { jwtGuard } from "./auth/guards/jwt-auth.guard";
import { blockService } from "./users/block.service";

@Controller('friend')
@UseGuards(jwtGuard) // global guards
export class FrinedCtroller {
  constructor(private readonly block_base: blockService, private readonly authService: AuthService) {}

  
}