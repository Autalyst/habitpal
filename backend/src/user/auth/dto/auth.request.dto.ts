import { IsEmail, IsNotEmpty, IsString, Length } from "@nestjs/class-validator";


export class AuthRequestDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    @Length(8)
    password: string;
}