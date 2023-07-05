import { Module } from '@nestjs/common';
import { ContestController } from './contest.controller';
import { ContestService } from './contest.service';
import { AuthModule } from 'src/auth/auth.module';
@Module({
  imports: [AuthModule],
  controllers: [ContestController],
  providers: [ContestService],
})
export class ContestModule {}
