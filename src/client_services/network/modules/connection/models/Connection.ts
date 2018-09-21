import {plainToClassFromExist} from "class-transformer";

export class Connection {
    id: string;
    first_name: string;
    last_name: string;

    constructor(init?: Partial<Connection>) {
        plainToClassFromExist(this, init);
    }

}