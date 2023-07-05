// import { ForbiddenException, Injectable } from '@nestjs/common';
// import { PrismaService } from '../prisma/prisma.service';
// import { CreateUserDto } from './dto';
// import * as argon from 'argon2';
// import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

// @Injectable()
// export class UserService {
//     constructor(private prisma: PrismaService) {}

//     async createUser(dto: CreateUserDto) {
//         const hash = await argon.hash(dto.password);

//         try {
//             await this.prisma.user.create({
//                 data: {
//                     email: dto.email,
//                     userAuth: {
//                         create: {
//                             hash: hash
//                         }
//                     }
//                 }
//             });
//         } catch (error) {
//             if (error instanceof PrismaClientKnownRequestError) {
//                 if (error.code === 'P2002') {
//                     throw new ForbiddenException('Email address is unavailable');
//                 }
//             }
//         }
//     }
// }
