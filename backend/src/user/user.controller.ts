import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { UserDto } from "./dto/user.dto";
import { Public } from "src/auth/auth.decorator";
import { UserCreateDto } from "./dto/user-create.dto";
import { UserService } from "./user.service";
import { CurrentAuthService } from "src/auth/current-auth.service";

@Controller('users')
export class UserController {

    constructor(
        private currentAuthService: CurrentAuthService,
        private userService: UserService
    ) { }

    @Get('/current')
    async getCurrentUser(): Promise<UserDto> {
        const currentUser = this.currentAuthService.currentUser();
        return this.userService.findUser(currentUser.id);
    }

    @Get('/:userId')
    async getUser(@Param('userId') userId: string): Promise<UserDto> {
        return this.userService.findUser(userId);
    }

    @Public()
    @Post()
    async createUser(
        @Body() userCreateDto: UserCreateDto
    ): Promise<UserDto> {
        return this.userService.createUser(userCreateDto);
    }
}