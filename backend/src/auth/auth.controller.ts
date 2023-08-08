import { Body, Controller, Delete, HttpCode, Param, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './auth.decorator';
import { AuthRequestDto } from './dto/auth.request.dto';
import { AuthResultDto } from './dto/auth.result.dto';

@Controller('auth')
export class AuthController {

    constructor(
        private authService: AuthService
    ) { }

    @Public()
    @Post()
    async authorize(
        @Body() authRequestDto: AuthRequestDto
    ): Promise<AuthResultDto> {
        const authInfo = await this.authService.authorize(authRequestDto);
        return authInfo;
    }

    @Delete(':refreshToken')
    @HttpCode(200)
    async destroyRefreshToken(@Param('refreshToken') refreshToken: string) {
        await this.authService.destroyTokenByRefreshToken(refreshToken);
    }

    @Public()
    @Post('/user')
    async createUser(
        @Body() userCreateRequestDto: Object
    ): Promise<Object> {
        return null;
    }
}
