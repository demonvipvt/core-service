import { LogService } from "../../log";
import { Service } from "../../ioc";
import {ClientConfiguration, ClientService} from "../client_service_core";

@Service()
export class NotificationClientService extends ClientService {
  constructor(private logService: LogService) {
    super(new ClientConfiguration({
      service_name: "bluesky-notification-service"
    }));
  }
}
