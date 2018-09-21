import {Inject} from "typedi";
import {merge, get} from "lodash";
import {Service} from "../../ioc";
import {ApplicationService} from "../../ApplicationService";
import {ConsulService} from "../../consul";
import {ApplicationConfiguration} from "../../ApplicationConfiguration";
import Seed from "../../sample_service/modules/seed/models/Seed";
import {plainToClassFromExist} from "class-transformer";
import {ClientConfiguration} from "./ClientConfiguration";

const Resilient = require("resilient");


process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";

@Service()
export class ClientService extends ApplicationService {
    private httpClient: any;

    servers: string[] = [];


    @Inject()
    protected consulService: ConsulService;

    @Inject()
    protected applicationConfiguration: ApplicationConfiguration;

    constructor(private config: ClientConfiguration) {
        super();
    }

    isConsulEnabled(): boolean {
        return !!this.config.consul;
    }

    consulWatch() {
        const watcher = this.consulService.getConsul().watch({
            method: this.consulService.getConsul().health.service,
            options: {
                service: this.config.service_name,
                passing: true
            }
        } as any);

        watcher.on("change", (data: any[]) => {
            this.servers = data.map((entry: any): string => {
                return `${entry.Service.Address}:${entry.Service.Port}`;
            });
            // update HTTP Servers
            this.updateHttpServers(this.servers);
        });
    }

    updateHttpServers(servers: string[]) {
        this.httpClient.setServers(servers.map((server: string) => {
            return `${this.config.protocol}://${server}`;
        }));
    }

    initHttpClient(servers: string[] = []) {
        this.httpClient = Resilient({
            service: {basePath: this.config.context},
            balancer: {random: get(this.config, "balance.random", true)}
        });

        this.updateHttpServers(servers);
    }

    getHttpClient() {
        return this.httpClient;
    }

    async start(): Promise<void> {

        const serviceName = get(this.config, "service_name");
        this.config = merge(this.config, (this.applicationConfiguration as any)[serviceName]);
        this.servers = this.config.servers;

        this.initHttpClient(this.servers);

        if (this.isConsulEnabled()) this.consulWatch();
    }

    async stop(): Promise<void> {
    }
}
