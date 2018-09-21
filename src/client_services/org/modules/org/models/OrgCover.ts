import {plainToClassFromExist} from "class-transformer";

export class OrgCover {
    id: string;
    cover_id: string;

    constructor(init?: Partial<OrgCover>) {
        plainToClassFromExist(this, init);
    }

}