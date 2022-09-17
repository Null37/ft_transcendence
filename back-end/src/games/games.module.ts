import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/Entity/users.entity';
import { Games } from 'src/Entity/games.entity';
import { GamesService } from './games.service';

@Module({
  imports: [TypeOrmModule.forFeature([Games, Users, ])] ,
  providers: [GamesService],
  exports: [GamesService],
})
export class GamesModule {}