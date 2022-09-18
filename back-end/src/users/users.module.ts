import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/Entity/users.entity';
import { friend } from 'src/Entity/friend.entity';
import { FriendService } from './friend.service';
import { blockService } from './block.service';
import { BlockLIST } from 'src/Entity/block.entity';
import { Games } from 'src/Entity/games.entity';
import { GamesService } from 'src/games/games.service';

@Module({
  imports: [TypeOrmModule.forFeature([Users, friend ,BlockLIST, Games])] ,
  providers: [UsersService, FriendService, blockService, GamesService],
  exports: [UsersService, FriendService, blockService, GamesService],
})
export class UsersModule {}