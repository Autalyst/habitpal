import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ContestModule } from './contest/contest.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    ContestModule, 
    AuthModule, UserModule, PrismaModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
