import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserDao } from './entity/user.dao';
import { UserAuthController } from './auth/auth.controller';
import { UserAuthService } from './auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UserAuthTokenDao } from './auth/entity/user-auth-token.dao';
import { APP_GUARD } from '@nestjs/core';
import { UserAuthGuard } from './auth/auth.guard';
import { UserCurrentAuthService } from './auth/current-auth.service';
import { UserAuthCleanupService } from './auth/auth-token-cleanup.service';
import { TypeOrmModule } from 'src/typeorm/typeorm.module';
import { UserProviders } from './entity/user.provider';
import { UserAuthTokenProviders } from './auth/entity/user-auth-token.provider';

@Module({
  imports: [
    JwtModule,
    TypeOrmModule
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: UserAuthGuard
    },
    ...UserProviders,
    ...UserAuthTokenProviders,
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
