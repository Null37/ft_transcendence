import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/Entity/users.entity';
import { Games } from 'src/Entity/games.entity';
import { GamesService } from './games.service';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [TypeOrmModule.forFeature([Games, Users, ])] ,
  providers: [GamesService, UsersService],
  exports: [GamesService, UsersService],
})
export class GamesModule {}