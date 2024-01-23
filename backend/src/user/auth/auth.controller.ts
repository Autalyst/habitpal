import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
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
        @Body() authRequestDto: AuthRequestDto
    ): Promise<AuthResultDto> {
        const authInfo = await this.authService.authorize(authRequestDto);
        return authInfo;
    }

    @Delete()
    async deleteAllAuthorizationForUser(
        @CurrentUser() user,
    ) {
        await this.authService.deleteAllAuthorization(user);
    }

    @Delete('/:id')
    async deleteAuthorizationForUser(
        @Param('id') id: number,
        @CurrentUser() user
    ) {
        await this.authService.deleteAuthorizationById(id, user);
    }

    // @Public()
    // @Post('/refresh')
    // async refreshAuthorization(
    //     @Body() authInfo: AuthResultDto
    // ): Promise<AuthResultDto> {
    //     return await this.authService.refreshAuthentication(authInfo);
    // }
}
