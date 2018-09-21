import {plainToClassFromExist} from "class-transformer";

export class UserName {
    id: string;
    first_name: string;
    last_name: string;
    name_config: boolean;

    constructor(init?: Partial<UserName>) {
        plainToClassFromExist(this, init);
    }

}