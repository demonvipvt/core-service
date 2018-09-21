import {plainToClassFromExist} from "class-transformer";
import {Address} from "../../../../../models";

export class UserAddress {
    id: string;
    address: Address

    constructor(init?: Partial<UserAddress>) {
        plainToClassFromExist(this, init);
    }

}