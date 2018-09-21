import {User} from "../../client_services/user/modules/user/models/User";
import {plainToClassFromExist} from "class-transformer";

export class Message<T> {
    topic: string;
    value: T;
    offset?: number;
    partition?: number;
    highWaterOffset?: number;
    key?: string;

    constructor(init?: Partial<Message<any>>) {
        plainToClassFromExist(this, init);
    }
}