import {plainToClassFromExist} from "class-transformer";
import {Address} from "../../../../../models";

export class User {
    id: string;
    first_name: string;
    last_name: string;
    name_config: boolean;
    avatar_id: boolean;
    cover_id: boolean;
    emails: string[];
    phones: string[];
    address: Address;

    constructor(init?: Partial<User>) {
        plainToClassFromExist(this, init);
    }

}