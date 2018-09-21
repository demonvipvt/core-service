import {plainToClassFromExist} from "class-transformer";

export class OrgEmail {
    id: string;
    emails: string[];

    constructor(init?: Partial<OrgEmail>) {
        plainToClassFromExist(this, init);
    }

}