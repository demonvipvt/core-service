import {plainToClassFromExist} from "class-transformer";

export class ClientConfiguration {
    service_name: string;
    consul?: boolean = true;
    protocol?: string = "http";
    context?: string = "/";
    servers?: string[] = [];

    constructor(init?: Partial<ClientConfiguration>) {
        plainToClassFromExist(this, init);
    }

}