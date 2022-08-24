import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/Entity/users.entity';
import { friend } from 'src/Entity/friend.entity';
import { FriendService } from './friend.service';
import { blockService } from './block.service';
import { BlockLIST } from 'src/Entity/block.entity';
import { historyervice } from './history.service';

@Module({
  imports: [TypeOrmModule.forFeature([Users, friend ,BlockLIST])] ,
  providers: [UsersService, FriendService, blockService, historyervice],
  exports: [UsersService, FriendService, blockService, historyervice],
})
export class UsersModule {}