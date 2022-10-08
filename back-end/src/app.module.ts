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
import { GameGateway } from './game.gateway';
import { CanvasGateway } from './canvas.gateway';
import { SpeedyGateway } from './speedy.gateway';
import { GamesModule } from './games/games.module';

@Module({
  imports: [AuthModule, 
    UsersModule,
    RoomsModule,
    GamesModule,
    TypeOrmModule.forRoot(
    {
        type: 'postgres',
        host: 'postgresql',
        port: 5432,
        username: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        autoLoadEntities: true,
        synchronize: true, // remove this shit 
    },
    ),
    //, {serveStaticOptions: {index: false , extensions: ['png', 'jpeg', 'jpg', 'bmp', 'ico']}}
    ServeStaticModule.forRoot({rootPath: join('/back-end/src', 'public'), serveRoot: '/public/',serveStaticOptions: {index: false},})
  ],
  controllers: [AppController, FrinedCtroller, BlockCtroller],
  providers: [AppService, pass_42Guard, AppGateway, GameGateway, CanvasGateway, SpeedyGateway],
})
export class AppModule {}
