import {Get, JsonController} from "routing-controllers";

@JsonController("/health_check")
export class HttpHealthCheck {

    @Get("")
    async healthCheck(): Promise<string> {
        return "OK";
    }
}


