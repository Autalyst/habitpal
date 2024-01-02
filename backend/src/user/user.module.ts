import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserDao } from './user.dao';
import { UserAuthController } from './auth/auth.controller';
import { UserAuthService } from './auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UserAuthTokenDao } from './auth/auth-token.dao';
import { APP_GUARD } from '@nestjs/core';
import { UserAuthGuard } from './auth/auth.guard';
import { UserCurrentAuthService } from './auth/current-auth.service';
import { UserAuthCleanupService } from './auth/auth-token-cleanup.service';

@Module({
  imports: [
    JwtModule
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: UserAuthGuard
    },
    UserService,
    UserDao,
    UserAuthService,
    UserCurrentAuthService,
    UserAuthTokenDao,
    UserAuthCleanupService
  ],
  controllers: [
    UserController,
    UserAuthController
  ],
  exports: [
    UserCurrentAuthService
  ]
})
export class UserModule {}
