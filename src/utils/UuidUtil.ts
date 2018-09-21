import {types} from "cassandra-driver";
import Uuid = types.Uuid;

export class UuidUtil {

    static uuid() {
        return types.Uuid.random();
    }

    static timeuuid() {
        return types.TimeUuid.now();
    }

    static isUuid(uuid: any) {
        return uuid instanceof Uuid;
    }
}