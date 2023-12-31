import { Body, Controller, Post } from '@nestjs/common';
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

    @Public()
    @Post('/refresh')
    async refreshAuthorization(
        @Body() authInfo: AuthResultDto
    ): Promise<AuthResultDto> {
        return await this.authService.refreshAuthentication(authInfo);
    }
}
