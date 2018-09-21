import Seed from "./models/Seed";
import {SeedDao} from "./SeedDao";
import {valid, validation} from "../../../validation";
import {authorized, AuthUser} from "../../../security";
import {Service} from "../../../ioc";
import {DateUtil, UuidUtil} from "../../../utils";
import {UserClient, User} from "../../../client_services/user";
import {
    NotificationClient,
    Notification
} from "../../../client_services/notification";
import {OrgClient} from "../../../client_services/org";
import {UserName} from "../../../client_services/user/modules/user/models/UserName";
import {Message} from "../../../queue/kafka";

const SEED_SERVICE_GROUP = "SEED_SERVICE_GROUP";

@Service()
export class SeedService {
    constructor(private seedDao: SeedDao,
                private userClient: UserClient) {
        console.log("dsfd")
        userClient.subscribeUserNameUpdate(SEED_SERVICE_GROUP, this.onUserNameUpdate.bind(this));
    }

    onUserNameUpdate(message: Message<UserName>) {
        console.log(message.value);
    }

    @authorized(["seed:read"])
    async findAll(user: AuthUser): Promise<Seed[]> {
        return (await this.seedDao.findAll()).map(Seed.fromCassandra);
    }

    @authorized(["seed:read"])
    async findById(id: string): Promise<Seed> {
        return Seed.fromCassandra(await this.seedDao.findById(id));
    }

    @authorized(["seed:update"])
    async deleteById(id: string): Promise<Seed> {
        return Seed.fromCassandra(await this.seedDao.findById(id));
    }

    @authorized(["seed:create"])
    @validation()
    async create(@valid() seed: Seed, user: AuthUser): Promise<Seed> {
        const cassandraSeed = Seed.toCassandra(seed);
        cassandraSeed.id = UuidUtil.uuid().toString();
        cassandraSeed.created_at = DateUtil.datetime();
        return Seed.fromCassandra(await this.seedDao.create(cassandraSeed));
    }
}
