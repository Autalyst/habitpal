import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './auth.decorator';
import { AuthRequestDto } from './dto/auth.request.dto';
import { Response } from 'express';
import { AuthResultDto } from './dto/auth.result.dto';

@Controller('auth')
export class AuthController {

    constructor(
        private authService: AuthService
    ) { }

    @Public()
    @Post()
    async authorize(
        @Body() authRequestDto: AuthRequestDto,
        @Res({ passthrough: true}) response: Response,
    ): Promise<AuthResultDto> {
        console.log("AUTH CONTROLLER");
        const authInfo = await this.authService.authorize(authRequestDto);

        const refreshToken = await this.authService.createRefreshToken(authInfo);
        response.cookie('refresh-token', refreshToken, {
            httpOnly: true
        });

        return authInfo;
    }
    
    // todo refresh token logic
}
