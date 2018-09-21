import { SeedRest } from "./modules/seed/SeedRest";
import { Application } from "../index";
import { AuthClientService } from "../client_services/auth/AuthClientService";
import { UserClientService } from "../client_services/user/UserClientService";
import { OrgClientService } from "../client_services/org";
import { NotificationClientService } from "../client_services/notification";
import {Container} from "typedi";
import {UserClient, UserTopic} from "../client_services/user/modules/user";

export class SeedApplication extends Application {
  constructor(config: string = "./src/sample_service/config.yml") {
    super(
      config,
      [SeedRest],
      [
        AuthClientService,
        UserClientService,
        // OrgClientService,
        // NotificationClientService
      ]
    );
  }
}
//

setInterval(() => {
    (Container.get(UserClient)).publish(UserTopic.USER_NAME_UPDATE, {
        "id": "user_bd3b4a95-de39-415b-978c-b686c4e7cfe9",
        "first_name": "Nhuận",
        "last_name": "Lại Đức " + new Date().getTime(),
    });
}, 2000);