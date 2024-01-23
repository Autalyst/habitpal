import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { UserAuthService } from './auth.service';
import { Public } from './auth.decorator';
import { AuthRequestDto } from './dto/auth.request.dto';
import { AuthResultDto } from './dto/auth.result.dto';

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
    async deleteAllAuthorizationForUser() {
        await this.authService.deleteAllAuthorization();
    }

    @Delete('/:id')
    async deleteAuthorizationForUser(
        @Param('id') id: number 
    ) {
        await this.authService.deleteAuthorizationById(id);
    }

    // @Public()
    // @Post('/refresh')
    // async refreshAuthorization(
    //     @Body() authInfo: AuthResultDto
    // ): Promise<AuthResultDto> {
    //     return await this.authService.refreshAuthentication(authInfo);
    // }
}
