import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/Entity/users.entity';
import { friend } from 'src/Entity/friend.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Users, friend])] ,
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}