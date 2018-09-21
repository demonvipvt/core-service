import {Service} from "../../../../ioc";
import {LogService} from "../../../../log";
import {RestClient} from "../../../client_service_core";
import {KafkaService} from "../../../../queue/kafka";
import {ConsumerOptions} from "kafka-node";
import {OrgClientService} from "../../OrgClientService";
import {Message} from "../../../../queue/kafka/Message";
import {UserAvatar} from "../../../user/modules/user/models/UserAvatar";
import {UserEmail} from "../../../user/modules/user/models/UserEmail";
import {UserPhone} from "../../../user/modules/user/models/UserPhone";
import {UserAddress} from "../../../user/modules/user/models/UserAddress";
import {OrgAvatar} from "./models/OrgAvatar";
import {OrgCover} from "./models/OrgCover";
import {Org} from "./models";

export enum OrgTopic {
    ORG_NAME_UPDATE = "ORG_NAME_UPDATE_TOPIC",

    ORG_ADDRESS_UPDATE = "ORG_ADDRESS_UPDATE_TOPIC",

    ORG_EMAIL_UPDATE = "ORG_EMAIL_UPDATE_TOPIC",

    ORG_PHONE_UPDATE = "ORG_PHONE_UPDATE_TOPIC",

    ORG_AVATAR_UPDATE = "ORG_AVATAR_UPDATE_TOPIC",

    ORG_AVATAR_INVERTED_UPDATE = "ORG_AVATAR_INVERTED_UPDATE_TOPIC",

    ORG_COVER_INVERTED_UPDATE = "ORG_COVER_INVERTED_UPDATE_TOPIC",

    ORG_CREATE = "ORG_CREATE_TOPIC",

    ORG_DELETE = "ORG_DELETE_TOPIC",
}


@Service()
export class OrgClient extends RestClient {
    constructor(logService: LogService,
                orgClientService: OrgClientService,
                private kafkaService: KafkaService) {
        super("/orgs", logService, orgClientService);
    }

    private async publish(topic: OrgTopic, message: any): Promise<void> {
        if (!this.kafkaService) throw new Error("Publish method requires Kafka Configuration");

        if (!message.id) throw new Error("Message id is required");

        await this.kafkaService.publish(topic,message);
    }

    async publishOrgAvatarInvertedUpdate(orgAvatar: OrgAvatar): Promise<void> {
        return this.publish(OrgTopic.ORG_AVATAR_INVERTED_UPDATE, orgAvatar);
    }

    async publishOrgCoverInvertedUpdate(orgCover: OrgCover): Promise<void> {
        return this.publish(OrgTopic.ORG_COVER_INVERTED_UPDATE, orgCover);
    }

    private subscribe(group: string, topic: OrgTopic, cb: (message: Message<any>) => void, opt: ConsumerOptions = {}): void {
        if (!this.kafkaService) throw new Error("subscribe method requires Kafka Configuration");
        this.kafkaService.groupSubscribe(group, topic, cb, opt);
    }


    subscribeOrgAddressUpdate(group: string, cb: (message: Message<UserAddress>) => void, opt: ConsumerOptions = {}): void {
        this.subscribe(group, OrgTopic.ORG_NAME_UPDATE, cb, opt);
    }

    subscribeOrgEmailUpdate(group: string, cb: (message: Message<UserEmail>) => void, opt: ConsumerOptions = {}): void {
        this.subscribe(group, OrgTopic.ORG_EMAIL_UPDATE, cb, opt);
    }

    subscribeOrgPhoneUpdate(group: string, cb: (message: Message<UserPhone>) => void, opt: ConsumerOptions = {}): void {
        this.subscribe(group, OrgTopic.ORG_PHONE_UPDATE, cb, opt);
    }

    subscribeOrgAvatarUpdate(group: string, cb: (message: Message<UserAvatar>) => void, opt: ConsumerOptions = {}): void {
        this.subscribe(group, OrgTopic.ORG_AVATAR_UPDATE, cb, opt);
    }


    subscribeOrgCreate(group: string, cb: (message: Message<Org>) => void, opt: ConsumerOptions = {}): void {
        this.subscribe(group, OrgTopic.ORG_CREATE, cb, opt);
    }

    subscribeOrgDelete(group: string, cb: (message: Message<Org>) => void, opt: ConsumerOptions = {}): void {
        this.subscribe(group, OrgTopic.ORG_DELETE, cb, opt);
    }
}