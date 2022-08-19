import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/Entity/users.entity';
import { friend } from 'src/Entity/friend.entity';
import { FriendService } from './friend.service';
import { blockService } from './block.service';

@Module({
  imports: [TypeOrmModule.forFeature([Users, friend])] ,
  providers: [UsersService, FriendService, blockService],
  exports: [UsersService, FriendService, blockService],
})
export class UsersModule {}