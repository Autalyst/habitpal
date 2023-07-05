import { Controller, Get } from '@nestjs/common';

@Controller('contest')
export class ContestController {
    @Get()
    test() {
        return "Hello world";
    }
}
