import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { ContestCreateDto } from './dto/contest-create.dto';
import { ContestService } from './contest.service';
import { Public } from 'src/auth/auth.decorator';

@Controller('contest')
export class ContestController {

    constructor(
        private contestService: ContestService
    ) {}

    @Post()
    async createContest(
        @Body() contestCreateDto: ContestCreateDto,
    ) {
        return await this.contestService.createContest(contestCreateDto);
    }

    @Get()
    async getAllContests() {
        return await this.contestService.findAllContests();
    }
}
