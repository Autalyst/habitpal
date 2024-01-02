import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { UserDto } from "./dto/user.dto";
import { Public } from "./auth/auth.decorator";
import { UserCreateDto } from "./dto/user-create.dto";
import { UserService } from "./user.service";
import { UserCurrentAuthService } from "./auth/current-auth.service";

@Controller('users')
export class UserController {

    constructor(
        private currentAuthService: UserCurrentAuthService,
        private userService: UserService
    ) { }

    @Get('/current')
    getCurrentUser(): Promise<UserDto> {
        const currentUser = this.currentAuthService.currentUser();
        return this.userService.findUser(currentUser.id);
    }

    @Public()
    @Post()
    async createUser(
        @Body() userCreateDto: UserCreateDto
    ): Promise<UserDto> {
        const user = await this.userService.createUser(userCreateDto);
        return new UserDto(user);
    }
}