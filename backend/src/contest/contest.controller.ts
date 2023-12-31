import { Controller, Get } from "@nestjs/common";
import { ContestService } from "./contest.service";
import { CurrentAuthService } from "src/auth/current-auth.service";
import { Contest } from "@prisma/client";

@Controller('contest')
export class ContestController {
    constructor(
        private contestService: ContestService,
        private currentAuthService: CurrentAuthService
    ) {
        
    }

    @Get()
    async getAllContests(

    ): Promise<Contest[]> {
        const user = this.currentAuthService.currentUser();
        return this.contestService.getAvailableContestsForUser(user);
    }
}