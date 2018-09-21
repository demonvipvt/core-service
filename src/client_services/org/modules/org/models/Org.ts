import {plainToClassFromExist} from "class-transformer";
import {Address} from "../../../../../models";

export class Org {
    id: string;
    name: string;
    cover_id: string;
    avatar_id: string;
    address: Address;
    phones: string[];
    emails: string[];

    constructor(init?: Partial<Org>) {
        plainToClassFromExist(this, init);
    }
}