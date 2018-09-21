import {plainToClassFromExist} from "class-transformer";

export class OrgName {
    id: string;
    first_name: string;
    last_name: string;
    name_config: boolean;

    constructor(init?: Partial<OrgName>) {
        plainToClassFromExist(this, init);
    }

}