import {Service} from "../../ioc";
import {CoreOptions} from "request";
import {ClientService} from "./ClientService";
import {LogService} from "../../log";
import {ApiResponse} from "../../models/ApiResponse";

@Service()
export class RestClient {
    constructor(protected context: string, protected logService: LogService, protected clientService: ClientService) {
    }

    DEFAULT_OPTIONS = {
        headers: {
            "content-type": "application/json"
        }
    };

    isJson(options: CoreOptions) {
        return options.headers["content-type"] === "application/json";
    }

    async send(url: string, options?: CoreOptions): Promise<ApiResponse> {
        const opts: CoreOptions = {...this.DEFAULT_OPTIONS, ...options};

        if (this.isJson(opts)) {
            opts.body = JSON.stringify(opts.body);
        }
        const res = await this.clientService.getHttpClient().send(url, opts);

        if (res.status === 200 || res.status === 201) return Promise.resolve(JSON.parse(res.body));

        return Promise.reject(JSON.parse(res.body));
    }

    async get(url: string, options?: CoreOptions): Promise<ApiResponse> {
        return await this.send(`${this.context}${url}`, {method: "GET", ...options});
    }

    async post(url: string, options?: CoreOptions): Promise<ApiResponse> {
        return await this.send(`${this.context}${url}`, {method: "POST", ...options});
    }

    async put(url: string, options?: CoreOptions): Promise<ApiResponse> {
        return await this.send(`${this.context}${url}`, {method: "PUT", ...options});
    }

    async delete(url: string, options?: CoreOptions): Promise<ApiResponse> {
        return await this.send(`${this.context}${url}`, {method: "DELETE", ...options});
    }
}