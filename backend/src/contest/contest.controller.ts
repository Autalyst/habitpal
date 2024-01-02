import { Body, Controller, Get, Post } from "@nestjs/common";
import { ContestDto } from "./dto/contest.dto";

@Controller('contests')
export class ContestController {
    constructor() {
        
    }

    @Post()
    async createContest(
        @Body() contestDto: ContestDto
    ) {}

    // @Get()
    // async getAllContests(

    // ): Promise<Contest[]> {
    //     const user = this.currentAuthService.currentUser();
    //     return this.contestService.getAvailableContestsForUser(user);
    // }
}