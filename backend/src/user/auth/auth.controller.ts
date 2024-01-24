import { Body, Controller, Delete, HttpCode, Param, Post, Request, Response } from '@nestjs/common';
import { UserAuthService } from './auth.service';
import { Public } from './auth.decorator';
import { AuthRequestDto } from './dto/auth.request.dto';
import { AuthResultDto } from './dto/auth.result.dto';
import { CurrentUser } from './current-auth.decorator';

@Controller('user/auth')
export class UserAuthController {

    constructor(
        private authService: UserAuthService
    ) { }

    @Public()
    @Post()
    async authorize(
        @Body() authRequestDto: AuthRequestDto,
        @Response({ passthrough: true }) response
    ): Promise<AuthResultDto> {
        const authInfo = await this.authService.authorize(authRequestDto);

        return this.setupAuth(
            response,
            () => this.authService.authorize(authRequestDto)
        );
    }

    @HttpCode(204)
    @Delete()
    async deleteAllAuthorizationForUser(
        @CurrentUser() userId: number,
    ) {
        this.authService.deleteAllAuthorization(userId);
    }

    @HttpCode(204)
    @Delete('/:id')
    async deleteAuthorizationForUser(
        @Param('id') id: number,
        @CurrentUser() userId: number,
    ) {
        this.authService.deleteAuthorizationById(id, userId);
    }

    @Public()
    @Post('/refresh')
    async refreshAuthorization(
        @Request() request,
        @Response({ passthrough: true }) response,
    ): Promise<AuthResultDto> {
        const refreshToken = request.cookies['refreshToken'];
        return this.setupAuth(
            response,
            () => this.authService.refreshAuthorization(refreshToken)
        );
    }

    private async setupAuth(
        response,
        dataFunc: () => Promise<AuthResultDto>
    ): Promise<AuthResultDto> {
        const authInfo = await dataFunc();

        response.cookie('refreshToken', authInfo.refreshToken, {
            expires: new Date(new Date().getTime() + (3600 * 1000 * 24 * 7)),
            sameSite: 'strict',
            httpOnly: true
        });

        delete authInfo.refreshToken;
        
        return authInfo;
    }
}
