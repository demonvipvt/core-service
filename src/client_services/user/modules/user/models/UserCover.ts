import {plainToClassFromExist} from "class-transformer";

export class UserCover {
    id: string;
    cover_id: string;

    constructor(init?: Partial<UserCover>) {
        plainToClassFromExist(this, init);
    }

}