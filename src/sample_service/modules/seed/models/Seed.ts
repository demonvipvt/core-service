import CassandraSeed from "./CassandraSeed";
import {MaxLength} from "class-validator";
import {plainToClassFromExist, Expose, Exclude} from "class-transformer";

@Exclude()
export default class Seed {
    @Expose()
    id: string = null;

    @Expose()
    @MaxLength(20)
    first_name?: string = "";

    @Expose()
    @MaxLength(40)
    last_name?: string = "";

    constructor(init?: Partial<Seed>) {
        plainToClassFromExist(this, init);
    }

    static toCassandra(seed: Seed): CassandraSeed {
        return new CassandraSeed(seed);
    }

    static fromCassandra(cassandraSeed: CassandraSeed): Seed {
        return new Seed((cassandraSeed));
    }
}