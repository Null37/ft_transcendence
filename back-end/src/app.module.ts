import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { UsersModule } from './users/users.module';
import { AppGateway } from './app.gateway';

@Module({
  imports: [AuthModule, 
    UsersModule, 
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
  providers: [AppService, JwtAuthGuard, AppGateway],
})
export class AppModule {}
