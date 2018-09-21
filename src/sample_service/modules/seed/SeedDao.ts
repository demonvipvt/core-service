import CassandraSeed from "./models/CassandraSeed";
import {AbstractCassandraDao, Service} from "../../../index";

@Service()
export class SeedDao extends AbstractCassandraDao<CassandraSeed> {

    constructor() {
        super("seed", CassandraSeed);
    }
}