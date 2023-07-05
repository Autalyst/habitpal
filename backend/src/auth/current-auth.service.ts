import { Inject, Injectable, Scope } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { User } from "@prisma/client";
import { Request } from "express";

@Injectable({ scope: Scope.REQUEST })
export class CurrentAuthService {
    constructor(
        @Inject(REQUEST) private request: Request
    ) {}

    currentUser(): User {
        return this.request['user'] as User;
    }
}