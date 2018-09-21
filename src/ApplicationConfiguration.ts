import {ConsulConfiguration} from "./consul/ConsulConfiguration";
import {RestConfiguration} from "./rest/RestConfiguration";
import {CassandraConfiguration} from "./cassandra/CassandraConfiguration";
import {LogConfiguration} from "./log/LogConfiguration";
import {plainToClassFromExist} from "class-transformer";
import {KafkaConfiguration} from "./queue/kafka";

const fs = require("fs");
const yamlLoader = require("js-yaml");
const envsub = require("envsub");

export class ApplicationConfiguration {
    name: string;
    host: string = "172.0.0.1";
    tags: string[];
    user_token_trusted: boolean = false;
    rest: RestConfiguration;
    consul?: ConsulConfiguration;
    cassandra?: CassandraConfiguration;
    kafka?: KafkaConfiguration;
    log?: LogConfiguration;

    public constructor(init?: Partial<ApplicationConfiguration>) {
        plainToClassFromExist(this, init);
    }

    static async load(path: string): Promise<ApplicationConfiguration> {
        const configTemp = "./config.temp.yml";
        await envsub({templateFile: path, outputFile: configTemp});
        return new ApplicationConfiguration(yamlLoader.safeLoad(fs.readFileSync(configTemp, "utf8")));
    }
}