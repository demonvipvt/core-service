export class ConsulConfiguration {
    host: string;
    port: number;
    service: {
        check: {
            interval: string
            timeout: string
            deregister_critical_service_after: string
        }
    };
    client: {
        interval: string
    };
}
