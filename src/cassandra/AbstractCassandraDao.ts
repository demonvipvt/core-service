import {cloneDeepWith} from "lodash";
import {CassandraService} from "./CassandraService";
import {types} from "cassandra-driver";
import {Inject, Service} from "typedi";
import {UuidUtil} from "../utils/UuidUtil";
import LocalDate = types.LocalDate;

@Service()
export class AbstractCassandraDao<T extends object> {

    @Inject()
    protected cassandraService: CassandraService;

    constructor(protected tableName: string, protected Entity: any) {
        this.toCassandra = this.toCassandra.bind(this);
    }

    getTable(name?: string) {
        return this.cassandraService.getTable(name || this.tableName);
    }

    toCassandra(row: types.Row): T {
        return new this.Entity(cloneDeepWith(row, function (value: any) {
            if (UuidUtil.isUuid(value)) return value.toString();
            if (value instanceof LocalDate) return value.toString();
        }));
    }


    async findById(id: string): Promise<T> {
        const rows = await this.getTable().select().where("id", "=", id).exec();
        if (!rows[0]) return;
        return this.toCassandra(rows[0]);
    }

    async findAll(): Promise<T[]> {
        return (await this.getTable().select().exec()).map(this.toCassandra);
    }

    async create(entity: T | any): Promise<T | any> {
        await this.getTable().insert(entity).exec();
        return entity;
    }


    async exec(query: any): Promise<any> {
        return await query.allowFiltering().exec();
    }

    async batch(queries: any[]): Promise<any> {
        return await this.cassandraService.batch(queries);
    }

    async update(entity: T | any): Promise<T | any> {
        return entity;
    }
}