import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { CurrentAuthService } from './current-auth.service';

@Module({
  imports: [
    JwtModule
  ],
  providers: [
    AuthService,
    CurrentAuthService,
    {
        provide: APP_GUARD,
        useClass: AuthGuard
    },
  ],
  controllers: [AuthController],
  exports: [CurrentAuthService]
})
export class AuthModule {}
