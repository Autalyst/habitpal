import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule
  ],
  providers: [
    AuthService,
    {
        provide: APP_GUARD,
        useClass: AuthGuard
    },
  ],
  controllers: [AuthController]
})
export class AuthModule {}
