import {plainToClassFromExist} from "class-transformer";

export class UserPhone {
    id: string;
    phones: string[];

    constructor(init?: Partial<UserPhone>) {
        plainToClassFromExist(this, init);
    }

}