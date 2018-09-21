import {plainToClassFromExist} from "class-transformer";

export class OrgPhone {
    id: string;
    phones: string[];

    constructor(init?: Partial<OrgPhone>) {
        plainToClassFromExist(this, init);
    }

}