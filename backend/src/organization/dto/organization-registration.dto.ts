import { OrganizationDto } from "./organization.dto";
import { AuthRequestDto } from "src/auth/dto/auth.request.dto";

export interface OrganizationRegistrationDto {
    organization: OrganizationDto
    auth: AuthRequestDto
}