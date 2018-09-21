import {Container, Service} from "typedi";
import {
    ConsumerOptions, KafkaClient, Message as KafkaMessage, OffsetFetchRequest, Producer,
    ProduceRequest
} from "kafka-node";
import {KafkaConfiguration} from "./KafkaConfiguration";
import {ApplicationService} from "../../ApplicationService";
import {LogService} from "../../log";
import {ApplicationConfiguration} from "../../ApplicationConfiguration";
import {Message} from "./Message";

const kafkaLogging = require("kafka-node/logging");

function logAdapter(name: string) {
    let logService: LogService = null;
    const getLogService = (): LogService => {
        if (logService) return logService;
        return logService = Container.get(LogService);
    };

    return {
        debug: (...args: any[]) => getLogService().debug(...args),
        info: (...args: any[]) => getLogService().info(...args),
        warn: (...args: any[]) => getLogService().warn(...args),
        error: (...args: any[]) => getLogService().error(...args)
    };
}

kafkaLogging.setLoggerProvider(logAdapter);
const kafka = require("kafka-node");

@Service()
export class KafkaService extends ApplicationService {
    client: KafkaClient;
    producer: Producer;
    kafkaConfig: KafkaConfiguration;

    constructor(private logger: LogService, private config: ApplicationConfiguration) {
        super();
        this.kafkaConfig = (config as any).kafka;

    }

    getKafkaHost(): string {
        return this.kafkaConfig.hosts.join(",");
    }

    async start(): Promise<void> {
        this.client = new kafka.KafkaClient({kafkaHost: this.getKafkaHost()});
        this.client.connect();
        await this.initProducer();
    }

    async initProducer() {
        try {
            this.producer = new kafka.Producer(this.client);
            this.producer.on("error", (error) => {
                this.logger.error("Kafka producer is not ready to publish message");
            });
            this.producer.on("ready", () => {
                this.logger.info("Kafka producer is ready to publish message");
            });
        } catch (ex) {
            console.log(ex);
        }
    }

    subscribe(req: OffsetFetchRequest, cb: Function, opt: ConsumerOptions = {}): void {
        if (!this.client) throw new Error("Kafka client is required");

        (new kafka.Consumer(this.client, [req], opt))
            .on("message", function (message: KafkaMessage) {
                cb(new Message({
                    ...message,
                    value: JSON.parse(message.value as string)
                }));
            });
    }

    groupSubscribe(group: string, topics: string | string[], cb: Function, opt: ConsumerOptions = {}): void {

        if (!this.client) throw new Error("Kafka client is required");

        (new kafka.ConsumerGroup({
            kafkaHost: this.getKafkaHost(),
            fromOffset: "earliest",
            groupId: group,
            autoCommit: true
        }, topics))
            .on("message", (message: KafkaMessage) => {
                // console.log("message", message);
                try {
                    cb(new Message({
                        ...message,
                        value: JSON.parse(message.value as string)
                    }));
                } catch (ex) {
                    this.logger.error("Invalid Kafka message %o", ex);
                }
            });
    }

    async publish(topic: string, message: any): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.producer.send([{
                topic: topic,
                messages: JSON.stringify(message),
                key: message.id
            }], (err: any, data: any) => {
                // console.log("err", err);
                if (err) reject(err);
                else resolve(data);
            });
        });
    }


    async stop(): Promise<void> {
        this.client.close();
    }

    static isEnabled(cfg: ApplicationConfiguration | any): boolean {
        return !!cfg.kafka;
    }
}
