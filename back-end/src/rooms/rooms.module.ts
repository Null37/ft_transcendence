import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rooms } from 'src/Entity/rooms.entity';
import { RoomUsers } from 'src/Entity/roomsUser.entity';
import { RoomController } from './rooms.controller';
import { RoomsService } from './rooms.service';
@Module({
  imports: [TypeOrmModule.forFeature([Rooms, RoomUsers])] ,
  providers: [RoomsService],
  exports: [RoomsService],
  controllers: [RoomController]
})
export class RoomsModule {}