import {plainToClassFromExist} from "class-transformer";

export class UserRequest {
    ids: string[];

    constructor(init?: Partial<UserRequest>) {
        plainToClassFromExist(this, init);
    }

}
