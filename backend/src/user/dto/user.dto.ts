import { User } from "../entity/user.entity"

export class UserDto {
    id: string
    email: string
    createdAt: Date
    updatedAt: Date

    constructor(user: User) {
        this.id = user.id;
        this.email = user.email;
        this.createdAt = user.createdAt;
        this.updatedAt = user.updatedAt;
    }
}