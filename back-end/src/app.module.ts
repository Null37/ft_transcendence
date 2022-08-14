import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { pass_42Guard } from './auth/guards/passport-42-auth.guard';
import { UsersModule } from './users/users.module';
import { AppGateway } from './app.gateway';
import { RoomsModule } from './rooms/rooms.module';

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
    }
  )],
  controllers: [AppController],
  providers: [AppService, pass_42Guard],
})
export class AppModule {}
