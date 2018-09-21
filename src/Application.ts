import "reflect-metadata";
import {RestService} from "./rest/RestService";
import {ApplicationConfiguration} from "./ApplicationConfiguration";
import {ApplicationService} from "./ApplicationService";
import {ConsulService} from "./consul/ConsulService";
import {CassandraService} from "./cassandra/CassandraService";
import {LogService} from "./log";
import {Container} from "typedi";
import {KafkaService} from "./queue/kafka";

export abstract class Application {

    private DEFAULT_SERVICES: any[] = [
        ConsulService,
        CassandraService,
        KafkaService
    ];

    Services: ApplicationService[];
    Rests: Function[];

    constructor(private cfg: ApplicationConfiguration | string, Rests: Function[], Services: any[]) {
        this.Services = [...this.DEFAULT_SERVICES, ...Services, RestService];
        this.Rests = Rests;
    }

    getCfg(): ApplicationConfiguration {
        return this.cfg as ApplicationConfiguration;
    }

    async start(): Promise<void> {
        this.cfg = typeof this.cfg === "string" ? await ApplicationConfiguration.load(this.cfg as string) : this.cfg;

        const logService = await (new LogService(this.cfg).start());
        logService.info("Application is starting...");

        Container.set("rests", this.Rests);
        Container.set(LogService, logService);
        Container.set(Application, this);
        Container.set(ApplicationConfiguration, this.cfg);
        try {
            logService.info(`Application services are starting...`);
            let Service: any;
            for (Service of this.Services) {
                if (!Service.isEnabled || (Service.isEnabled && Service.isEnabled(this.cfg))) await (Container.get(Service) as any).start();
            }
            logService.info(`Application services are started`);
            logService.info(`Application is started`);

            // process.on("uncaughtException", function (err) {
            //     logService.error("uncaught exception: %o", err);
            // });

            // Init SIGINT hook
            process.on("SIGINT", async () => {
                await this.stop();
                process.exit(0);
            });
        } catch (ex) {
            logService.error(ex.stack || ex.message);
        }
    }



    async stop() {
        const logService = Container.get(LogService);
        try {
            logService.info(`Application is stopping...`);
            logService.info(`Application services is stopping...`);
            let Service: any;
            for (Service of this.Services) {
                if (!Service.isEnabled || (Service.isEnabled && Service.isEnabled(this.cfg))) await (Container.get(Service) as ApplicationService).stop();
            }
            logService.info(`Application services is stopped`);
            logService.info(`Application is stopped`);
        } catch (ex) {
            logService.error(ex);
        }
    }
}