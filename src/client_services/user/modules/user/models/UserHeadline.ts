import {plainToClassFromExist} from "class-transformer";

export class UserHeadline {
    id: string;
    headline: string;

    constructor(init?: Partial<UserHeadline>) {
        plainToClassFromExist(this, init);
    }

}