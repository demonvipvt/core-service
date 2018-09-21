export class PaginationRequest {
    offset?: string;
    limit?: number = 50;

    constructor(init?: Partial<PaginationRequest>) {
        Object.assign(this, init);
    }
}