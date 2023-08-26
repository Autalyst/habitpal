import { Controller, Get } from "@nestjs/common";

@Controller('organization/:organizationId/user')
export class UserController {
    @Get()
    async getUsers() {
        
    }

    @Get('/:userId')
    async getUser() {

    }
}