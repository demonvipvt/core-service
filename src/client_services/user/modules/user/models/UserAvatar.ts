import {plainToClassFromExist} from "class-transformer";

export class UserAvatar {
    id: string;
    avatar_id: string;

    constructor(init?: Partial<UserAvatar>) {
        plainToClassFromExist(this, init);
    }

}