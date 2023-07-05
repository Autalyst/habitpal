import { Module } from '@nestjs/common';
import { ContestController } from './contest.controller';
// import { ContestService } from './contest.service';
@Module({
  controllers: [ContestController],
  providers: [],
})
export class ContestModule {}
