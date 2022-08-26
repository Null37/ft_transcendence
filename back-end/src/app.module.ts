import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { pass_42Guard } from './auth/guards/passport-42-auth.guard';
import { UsersModule } from './users/users.module';
import { AppGateway } from './app.gateway';
import { RoomsModule } from './rooms/rooms.module';
import { FrinedCtroller } from './friend.controller';
import { BlockCtroller } from './block.controller';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { historyCtroller } from './history.controller';
import { GameGateway } from './game.gateway';

@Module({
  imports: [AuthModule, 
    UsersModule,
	RoomsModule,
    TypeOrmModule.forRoot(
    {
        type: 'postgres',
        host: 'postgresql',
        port: 5432,
        username: 'transcendence',
        password: 'transcendence',
        autoLoadEntities: true,
        synchronize: true,
    },
    ),
    //, {serveStaticOptions: {index: false , extensions: ['png', 'jpeg', 'jpg', 'bmp', 'ico']}}
    ServeStaticModule.forRoot({rootPath: join('/back-end/src', 'public'), serveRoot: '/public/',serveStaticOptions: {index: false},})
  ],
  controllers: [AppController, FrinedCtroller, BlockCtroller, historyCtroller],
  providers: [AppService, pass_42Guard, AppGateway, GameGateway],
})
export class AppModule {}
