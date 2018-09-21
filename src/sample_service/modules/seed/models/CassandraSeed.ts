export default class CassandraSeed {
    id: string;
    first_name?: string;
    last_name?: string;
    created_at?: Date;

    public constructor(init?: Partial<CassandraSeed>) {
        Object.assign(this, init);
    }
}
