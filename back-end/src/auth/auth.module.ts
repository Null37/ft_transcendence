import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { passport_42 } from './strategies/42-passoert.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
  ],
  providers: [AuthService, passport_42],
  exports: [AuthService],
})
export class AuthModule {}
