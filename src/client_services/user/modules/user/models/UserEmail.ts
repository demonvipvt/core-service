import {plainToClassFromExist} from "class-transformer";

export class UserEmail {
    id: string;
    email: string[];

    constructor(init?: Partial<UserEmail>) {
        plainToClassFromExist(this, init);
    }

}