import { Service } from "../../../../ioc";
import { LogService } from "../../../../log";
import { RestClient } from "../../../client_service_core";
import { NotificationClientService } from "../../NotificationClientService";
import { CoreOptions } from "request";
import { Notification } from "./model/Notification";

@Service()
export class NotificationClient extends RestClient {
  constructor(
    logService: LogService,
    notificationClientService: NotificationClientService
  ) {
    super("/notifications", logService, notificationClientService);
  }

  async create(notification: Notification, access_token: string): Promise<any> {
    // Setup request options
    const options: CoreOptions = {
      body: JSON.stringify(notification),
      headers: {
        Authorization: access_token
      }
    };
    return await this.post(`/`, options);
  }
}
