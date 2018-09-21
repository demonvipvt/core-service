import {plainToClassFromExist} from "class-transformer";
import {Address} from "../../../../../models";

export class OrgAddress {
    id: string;
    address: Address;

    constructor(init?: Partial<OrgAddress>) {
        plainToClassFromExist(this, init);
    }

}