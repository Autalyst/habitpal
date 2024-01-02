import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { ScheduleModule } from '@nestjs/schedule';
// import { ContestModule } from './contest/contest.module';
import { TypeOrmModule } from './typeorm/typeorm.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule,
    UserModule,
    // ContestModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
