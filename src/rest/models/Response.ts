import {ApplicationStatus} from "./ApplicationStatus";

export class Response<T> {
    status: ApplicationStatus;
    data: T;

    constructor() {

    }

    setStatus(status: ApplicationStatus): Response<T> {
        this.status = status;
        return this;
    }

    setData(data: T): Response<T> {
        this.data = data;
        return this;
    }

    static ok<T>(data: T): Response<T> {
        return new Response<T>().setStatus(ApplicationStatus.OK).setData(data);
    }
}