import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { OrganizationRegistrationDto } from "./dto/organization-registration.dto";

@Controller('organization')
export class OrganizationController {
    constructor() {}

    @Post()
    async registerOrganization(
        @Body() organizationRegistrationDto: OrganizationRegistrationDto
    ) {
        
    }

    @Get('/:organizationId')
    async getOrganization(
        @Param('organizationId') organizationId: string
    ) {
        
    }
}