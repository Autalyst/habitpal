import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { UserDto } from "./dto/user.dto";
import { Public } from "./auth/auth.decorator";
import { UserCreateDto } from "./dto/user-create.dto";
import { UserService } from "./user.service";
import { CurrentUser } from "./auth/current-auth.decorator";

@Controller('users')
export class UserController {

    constructor(
        private userService: UserService
    ) { }

    @Get('/current')
    getCurrentUser(
        @CurrentUser() user
    ): Promise<UserDto> {
        return this.userService.findUser(user.id);
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