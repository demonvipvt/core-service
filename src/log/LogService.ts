import {ApplicationService} from "../ApplicationService";
import {ApplicationConfiguration} from "../ApplicationConfiguration";
import {Logger, format, createLogger} from "winston";
import {Service} from "../ioc";

const winston = require("winston");
const {combine, timestamp, label, printf, splat} = format;

const myFormat = printf(info => {
    return `[${info.service_name}] ${info.service_address} ${info.timestamp} [${info.level.toUpperCase()}] ${info.message}`;
});


@Service()
export class LogService extends ApplicationService {

    private logger: Logger;

    constructor(private cfg: ApplicationConfiguration) {
        super();
    }

    meta(key: string, value: string): any {
        return format((info: any, opts: any) => {
            info[key] = value;
            return info;
        });
    }

    async start(): Promise<any> {
        // Ignore log messages if the have { private: true }
        const isSecret = /super secret/;
        const filterSecret = format((info, opts) => {
            info.message = info.message.replace(isSecret, "su*** se****");
            return info;
        });


        const fluentTransport = require("fluent-logger").support.winstonTransport();
        this.logger = createLogger({
            format: combine(
                filterSecret(),
                label({label: this.cfg.name}),
                this.meta("service_name", this.cfg.name)(),
                this.meta("service_address", this.cfg.host || "172.0.0.1")(),
                timestamp(),
                splat(),
                myFormat
            ),
            transports: [new (winston.transports.Console)(), new fluentTransport({tag: this.cfg.name, ...this.cfg.log})]
        });

        this.logger.on("logging", (transport, level, message, meta) => {
            if (meta.end && transport.sender && transport.sender.end) {
                transport.sender.end();
            }
        });

        return this;
    }

    public debug(...args: any[]): LogService {
        (this.logger.log as any)("debug", ...args);
        return this;
    }

    public error(...args: any[]): LogService {
        (this.logger.log as any)("error", ...args);
        return this;
    }

    public info(...args: any[]): LogService {
        (this.logger.log as any)("info", ...args);
        return this;
    }

    public warn(...args: any[]): LogService {
        (this.logger.log as any)("warn", ...args);
        return this;
    }

    static isEnabled(cfg: ApplicationConfiguration): boolean {
        return !!cfg.log;
    }
}