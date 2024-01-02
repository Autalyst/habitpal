import { Inject, Injectable, Scope } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import { User } from "../entity/user.entity";

@Injectable({ scope: Scope.REQUEST })
export class UserCurrentAuthService {
    constructor(
        @Inject(REQUEST) private request: Request
    ) {}

    currentUser(): User {
        return this.request['user'] as User;
    }
}