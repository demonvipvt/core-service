import {ApplicationConfiguration} from "./ApplicationConfiguration";

export abstract class ApplicationService {

    async start(): Promise<void> {

    }

    async stop(): Promise<void> {

    }

    static isEnabled(cfg: ApplicationConfiguration): boolean {
        return true;
    }
}