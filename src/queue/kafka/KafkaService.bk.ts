// import {Container, Service} from "typedi";
// import {
//     ConsumerOptions, KafkaClient, Message as KafkaMessage, OffsetFetchRequest, Producer,
//     ProduceRequest
// } from "kafka-node";
// import {KafkaConfiguration} from "./KafkaConfiguration";
// import {ApplicationService} from "../../ApplicationService";
// import {LogService} from "../../log";
// import {ApplicationConfiguration} from "../../ApplicationConfiguration";
// import {Message} from "./Message";
//
// // const kafkaLogging = require("kafka-node/logging");
//
// const Kafka = require("node-rdkafka");
// //
// // function logAdapter(name: string) {
// //     let logService: LogService = null;
// //     const getLogService = (): LogService => {
// //         if (logService) return logService;
// //         return logService = Container.get(LogService);
// //     };
// //
// //     return {
// //         debug: (...args: any[]) => getLogService().debug(...args),
// //         info: (...args: any[]) => getLogService().info(...args),
// //         warn: (...args: any[]) => getLogService().warn(...args),
// //         error: (...args: any[]) => getLogService().error(...args)
// //     };
// // }
// //
// // kafkaLogging.setLoggerProvider(logAdapter);
// // const kafka = require("kafka-node");
//
// @Service()
// export class KafkaService extends ApplicationService {
//     client: KafkaClient;
//     producer: any;
//     kafkaConfig: KafkaConfiguration;
//
//     constructor(private logger: LogService, private config: ApplicationConfiguration) {
//         super();
//         this.kafkaConfig = (config as any).kafka;
//
//     }
//
//     getKafkaHost(): string {
//         return this.kafkaConfig.hosts.join(",");
//     }
//
//     async start(): Promise<void> {
//         // this.client = new kafka.KafkaClient({kafkaHost: this.getKafkaHost()});
//         // this.client.connect();
//         await this.initProducer();
//     }
//
//     async initProducer() {
//         try {
//             this.producer = new Kafka.Producer({
//                 "client.id": this.config.name,
//                 "metadata.broker.list": this.getKafkaHost()
//             });
//
//             this.producer.connect();
//
//             this.producer.on("event.error", (error: any) => {
//                 console.log("ERR", error);
//                 this.logger.error("Kafka producer is not ready to publish message");
//             });
//             this.producer.on("ready", () => {
//                 this.logger.info("Kafka producer is ready to publish message");
//             });
//         } catch (ex) {
//             console.log(ex);
//         }
//     }
//
//     //
//     // subscribe(req: OffsetFetchRequest, cb: Function, opt: ConsumerOptions = {}): void {
//     //     if (!this.client) throw new Error("Kafka client is required");
//     //
//     //     (new kafka.Consumer(this.client, [req], opt))
//     //         .on("message", function (message: KafkaMessage) {
//     //             cb(new Message({
//     //                 ...message,
//     //                 value: JSON.parse(message.value as string)
//     //             }));
//     //         });
//     // }
//
//     groupSubscribe(group: string, topics: string | string[], cb: Function, opt: ConsumerOptions = {}): void {
//         console.log(topics)
//         const stream = Kafka.KafkaConsumer.createReadStream({
//             "group.id": group,
//             "metadata.broker.list": this.getKafkaHost(),
//         }, {}, {
//             topics: topics
//         });
//
//         stream.consumer.connect();
//
//         stream.on("data", function (data: any) {
//             // Output the actual message contents
//             console.log("DSFS", data.value.toString());
//
//             try {
//                 cb(new Message({
//                     ...data,
//                     value: JSON.parse(data.value.toString())
//                 }));
//             } catch (ex) {
//                 this.logger.error("Invalid Kafka message %o", ex);
//             }
//         });
//     }
//
//     async publish(topic: string, message: any): Promise<any> {
//         return new Promise<any>((resolve, reject) => {
//             try {
//                 console.log(topic, message);
//                 this.producer.produce(topic, null, new Buffer(JSON.stringify(message)), message.key, Date.now());
//                 console.log("OK");
//             } catch (ex) {
//                 this.logger.error("A problem occurred when sending our message %o", ex);
//             }
//             resolve(true);
//         });
//     }
//
//
//     async stop(): Promise<void> {
//         this.client.close();
//     }
//
//     static isEnabled(cfg: ApplicationConfiguration | any): boolean {
//         return !!cfg.kafka;
//     }
// }
