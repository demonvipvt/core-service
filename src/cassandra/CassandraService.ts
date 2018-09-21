import {QueryOptions, types} from "cassandra-driver";
import ResultSet = types.ResultSet;
import {Service} from "../ioc";
import {ApplicationService} from "../ApplicationService";
import {ApplicationConfiguration} from "../ApplicationConfiguration";
import {LogService} from "../log";

@Service()
export class CassandraService extends ApplicationService {

    client: any;
    keyspace: any;

    constructor(private cfg: ApplicationConfiguration, private logService: LogService) {
        super();
        if (!CassandraService.isEnabled(this.cfg)) {
            this.logService.warn("Cassandra is not configured!");
            return;
        }

        const {hosts, keyspace} = cfg.cassandra;

        this.client = require("cassanknex")({
            connection: {
                contactPoints: hosts,
            },
            exec: { // default is '{}'
                prepare: true // default is 'true'
            }
        });
        this.keyspace = keyspace;
    }

    async start(): Promise<void> {
        this.logService.info(`Cassandra is connecting...`);
        await new Promise((resolve: Function, reject: Function) => {
            this.client.on("ready", (err: string) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
        this.logService.info(`Cassandra is connected`);
    }

    promisify(instance: any, method: string) {
        const exec = instance[method];
        instance[method] = async (...args: any[]) => {
            return await new Promise((resolve, reject) => {
                exec.apply(instance, [...args, (err: string, res: ResultSet) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(res.rows);
                    }
                }]);
            });
        };

    }

    async batch(queries: any[]): Promise<ResultSet | any> {
        return new Promise<ResultSet>((resolve: Function, reject: Function) => {
            this.client().batch({prepare: true}, queries, (err: any, result: ResultSet) => {
                if (!err) resolve(result);
                else reject(err);
            });
        });
    }

    getTable(table: string, keyspace: string = null): any {
        const kp = this.client(keyspace || this.keyspace).from(table);
        this.promisify(kp, "exec");
        return kp;
    }

    async execute(query: string, params?: any, options: QueryOptions = {prepare: true}): Promise<types.ResultSet> {
        return await this.client.execute(query, params, options);
    }

    static isEnabled(cfg: ApplicationConfiguration): boolean {
        return !!cfg.cassandra;
    }
}