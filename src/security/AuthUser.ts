import {plainToClassFromExist} from "class-transformer";

export class Role {
    id: string;
    name: string;
    permissions: string[];
}

export class OrgRole {
    org_id: string;
    roles: Role[];
}

export class AuthUser {
    user_id?: string;
    chat_id?: string;
    access_token?: string;
    roles?: OrgRole[];

    constructor(init?: Partial<AuthUser>) {
        return plainToClassFromExist(this, init);
    }
}