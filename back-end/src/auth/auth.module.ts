import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { passport_42 } from './strategies/42-passoert.strategy';
import { jwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: "My random secret key never let others"
    })
  ],
  providers: [AuthService, passport_42, jwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
