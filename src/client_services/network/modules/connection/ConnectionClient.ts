import {Service} from "../../../../ioc";
import {LogService} from "../../../../log";
import {RestClient} from "../../../client_service_core";
import {KafkaService} from "../../../../queue/kafka";
import {ConsumerOptions} from "kafka-node";
import {Connection} from "./models/Connection";
import {NetworkClientService} from "../../NetworkClientService";


export enum ConnectionTopic {
    CONNECTION_UPDATE = "CONNECTION_UPDATE_TOPIC",
    CONNECTION_CREATE = "CONNECTION_CREATE_TOPIC",
    CONNECTION_DELETE = "CONNECTION_DELETE_TOPIC"
}

@Service()
export class UserClient extends RestClient {
    constructor(logService: LogService,
                networkClientService: NetworkClientService,
                private kafkaService: KafkaService) {
        super("/connections", logService, networkClientService);
    }

    async publish(topic: ConnectionTopic, connection: Connection): Promise<void> {
        if (!this.kafkaService) throw new Error("Publish method requires Kafka Configuration");
        await this.kafkaService.publish(topic, connection);
    }

    subscribe(group: string, topic: ConnectionTopic, cb: Function, opt: ConsumerOptions = {}): void {
        if (!this.kafkaService) throw new Error("subscribe method requires Kafka Configuration");
        this.kafkaService.groupSubscribe(group, topic, cb, opt);
    }
}