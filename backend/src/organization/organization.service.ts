import { Injectable } from "@nestjs/common";
import { AuthService } from "src/auth/auth.service";
import { OrganizationRegistrationDto } from "./dto/organization-registration.dto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class OrganizationService {
    constructor(
        private authService: AuthService,
        private prismaService: PrismaService,
        private userService: UserService,
    ) {}

    async createNewOrganization(
        organizationRegistrationDto: OrganizationRegistrationDto
    ) {
        const organization = await this.prismaService.organization.create({
            data: {
                name: organizationRegistrationDto.organization.name
            }
        });
        const user = await this.userService.createUser(organization, organizationRegistrationDto.auth.email)
        this.authService.saveUserAuth(organizationRegistrationDto.auth, user)
    }

}