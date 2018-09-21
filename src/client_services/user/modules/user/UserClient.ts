import {Service} from "../../../../ioc";
import {LogService} from "../../../../log";
import {RestClient} from "../../../client_service_core";
import {KafkaService} from "../../../../queue/kafka";
import {UserClientService} from "../../UserClientService";
import {ConsumerOptions} from "kafka-node";
import {map, join} from "lodash";
import {User} from "./models/User";
import {Message} from "../../../../queue/kafka/Message";
import {UserName} from "./models/UserName";
import {UserAddress} from "./models/UserAddress";
import {UserEmail} from "./models/UserEmail";
import {UserPhone} from "./models/UserPhone";
import {UserAvatar} from "./models/UserAvatar";
import {UserCover} from "./models/UserCover";
import {UserHeadline} from "./models/UserHeadline";
import {UserRequest} from "./models/UserRequest";

const querystring = require("querystring");

export enum UserTopic {
    USER_NAME_UPDATE = "USER_NAME_UPDATE_TOPIC",

    USER_ADDRESS_UPDATE = "USER_ADDRESS_UPDATE_TOPIC",

    USER_EMAIL_UPDATE = "USER_EMAIL_UPDATE_TOPIC",

    USER_PHONE_UPDATE = "USER_PHONE_UPDATE_TOPIC",

    USER_AVATAR_UPDATE = "USER_AVATAR_UPDATE_TOPIC",

    USER_AVATAR_INVERTED_UPDATE = "USER_AVATAR_INVERTED_UPDATE_TOPIC",

    USER_COVER_INVERTED_UPDATE = "USER_COVER_INVERTED_UPDATE_TOPIC",

    USER_HEADLINE_INVERTED_UPDATE = "USER_HEADLINE_INVERTED_UPDATE_TOPIC",

    USER_CREATE = "USER_CREATE_TOPIC",

    USER_DELETE = "USER_DELETE_TOPIC",
}

@Service()
export class UserClient extends RestClient {
    constructor(logService: LogService,
                userClientService: UserClientService,
                private kafkaService: KafkaService) {
        super("/users", logService, userClientService);
    }

    async publish(topic: UserTopic, message: any): Promise<void> {
        if (!this.kafkaService) throw new Error("Publish method requires Kafka Configuration");

        if (!message.id) throw new Error("Message id is required");

        await this.kafkaService.publish(topic, message);
    }

    async publishUserAvatarInvertedUpdate(userAvatar: UserAvatar): Promise<void> {
        return this.publish(UserTopic.USER_AVATAR_INVERTED_UPDATE, userAvatar);
    }

    async publishUserCoverInvertedUpdate(userCover: UserCover): Promise<void> {
        return this.publish(UserTopic.USER_COVER_INVERTED_UPDATE, userCover);
    }

    async publishUserHeadInvertedUpdate(userHeadline: UserHeadline): Promise<void> {
        return this.publish(UserTopic.USER_HEADLINE_INVERTED_UPDATE, userHeadline);
    }


    subscribe(group: string, topic: UserTopic, cb: (message: Message<any>) => void, opt: ConsumerOptions = {}): void {
        if (!this.kafkaService) throw new Error("subscribe method requires Kafka Configuration");
        this.kafkaService.groupSubscribe(group, topic, cb, opt);
    }

    subscribeUserNameUpdate(group: string, cb: (message: Message<UserName>) => void, opt: ConsumerOptions = {}): void {
        this.subscribe(group + UserTopic.USER_NAME_UPDATE, UserTopic.USER_NAME_UPDATE, cb, opt);
    }

    subscribeUserAddressUpdate(group: string, cb: (message: Message<UserAddress>) => void, opt: ConsumerOptions = {}): void {
        this.subscribe(group + UserTopic.USER_ADDRESS_UPDATE, UserTopic.USER_ADDRESS_UPDATE, cb, opt);
    }

    subscribeUserEmailUpdate(group: string, cb: (message: Message<UserEmail>) => void, opt: ConsumerOptions = {}): void {
        this.subscribe(group + UserTopic.USER_EMAIL_UPDATE, UserTopic.USER_EMAIL_UPDATE, cb, opt);
    }

    subscribeUserPhoneUpdate(group: string, cb: (message: Message<UserPhone>) => void, opt: ConsumerOptions = {}): void {
        this.subscribe(group + UserTopic.USER_PHONE_UPDATE, UserTopic.USER_PHONE_UPDATE, cb, opt);
    }

    subscribeUserAvatarUpdate(group: string, cb: (message: Message<UserAvatar>) => void, opt: ConsumerOptions = {}): void {
        this.subscribe(group + UserTopic.USER_AVATAR_UPDATE, UserTopic.USER_ADDRESS_UPDATE, cb, opt);
    }

    subscribeUserCreate(group: string, cb: (message: Message<User>) => void, opt: ConsumerOptions = {}): void {
        this.subscribe(group + UserTopic.USER_CREATE, UserTopic.USER_CREATE, cb, opt);
    }

    subscribeUserDelete(group: string, cb: (message: Message<User>) => void, opt: ConsumerOptions = {}): void {
        this.subscribe(group + UserTopic.USER_DELETE, UserTopic.USER_DELETE, cb, opt);
    }

    async getUsers(req: UserRequest): Promise<User[]> {
        return map((await this.get("/find_by_ids?" + querystring.stringify({
            ...req,
            ids: join(req.ids, ",")
        }))).data, data => new User(data));
    }
}
