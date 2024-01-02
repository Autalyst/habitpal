import { BaseDto } from "src/util/base.dto"
import { User } from "../entity/user.entity"

export class UserDto extends BaseDto {
    email: string;

    constructor(user: User) {
        super(user);
        this.email = user.email;
    }
}