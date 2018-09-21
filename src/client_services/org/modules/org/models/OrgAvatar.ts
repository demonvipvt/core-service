import {plainToClassFromExist} from "class-transformer";

export class OrgAvatar {
    id: string;
    avatar_id: string;

    constructor(init?: Partial<OrgAvatar>) {
        plainToClassFromExist(this, init);
    }

}