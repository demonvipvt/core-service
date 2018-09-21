import {ApplicationService} from "../ApplicationService";
import {ApplicationConfiguration} from "../ApplicationConfiguration";
import {Consul} from "consul";
import {LogService} from "../log";
import {Container, Service} from "typedi";

@Service()
export class ConsulService implements ApplicationService {
    private consul: Consul;
    private CONSUL_ID: string;

    constructor(private logger: LogService, private cfg: ApplicationConfiguration) {
        const {host, port} = this.cfg.consul;
        this.consul = require("consul")({
            host, port
        });
        this.CONSUL_ID = require("uuid").v4();
    }

    getConsul(): Consul {
        return this.consul;
    }

    getServiceOptions(): any {
        const {name, host} = this.cfg;
        const port = this.cfg.rest.port;
        const {interval, timeout, deregister_critical_service_after} = this.cfg.consul.service.check;
        return {
            address: this.cfg.host,
            name: name,
            port: port,
            id: this.CONSUL_ID,
            tags: this.cfg.tags,
            check: {
                "id": this.cfg.name,
                "name": `${name} on port ${port}`,
                "http": `http://${host}:${port}/health_check`,
                "tls_skip_verify": false,
                "method": "GET",
                interval,
                timeout,
                deregister_critical_service_after
            }
        };
    }

    async start(): Promise<void> {
        this.logger.info(`Consul #${this.CONSUL_ID} is registering...`);
        this.getConsul().agent.service.register(this.getServiceOptions(), (err: any) => {
            this.logger.info(`Consul #${this.CONSUL_ID} is registered`);
        });
    }


    async stop(): Promise<void> {
        this.logger.info(`Consul #${this.CONSUL_ID} is de-registering...`);
        let serviceCfg = {id: this.CONSUL_ID};
        this.getConsul().agent.service.deregister(serviceCfg, (err: any) => {
            this.logger.info(`Consul #${this.CONSUL_ID} is de-registered.`, err);
        });
    }

    static isEnabled(cfg: ApplicationConfiguration): boolean {
        return !!cfg.consul;
    }
}
