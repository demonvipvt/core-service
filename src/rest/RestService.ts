import {Action, createKoaServer, useContainer} from "routing-controllers";
import {Service} from "../ioc";
import {ApplicationService} from "../ApplicationService";
import {ApplicationConfiguration} from "../ApplicationConfiguration";
import {HttpHealthCheck} from "./health_checks/HttpHealthCheck";
import {Container} from "typedi";
import {InvalidUserToken} from "../security/errors/PermissionDenied";
import {AuthClient} from "../client_services/auth";
import {AuthUser} from "../security/AuthUser";
import {LogService} from "../log";


@Service()
export class RestService extends ApplicationService {
    constructor(private cfg: ApplicationConfiguration, private logService: LogService) {
        super();
        useContainer(Container);
    }

    async start(): Promise<any> {
        const {port} = this.cfg.rest;
        return new Promise((resolve: Function) => {
            // force create all controllers in start phase
            (Container.get("rests") as Array<any> || []).forEach((Rest: any) => Container.get(Rest));

            createKoaServer({
                classTransformer: true,
                validation: false,
                controllers: [HttpHealthCheck, ...(Container.get("rests") as any[])],
                currentUserChecker: async (action: Action): Promise<AuthUser> => {
                    const token = action.request.headers["authorization"];
                    const authClient = Container.get(AuthClient);
                    const user = authClient.getUser(token);

                    if (!user) throw new InvalidUserToken();

                    if (!this.cfg.user_token_trusted) {
                        const isValid = await authClient.verifyToken(user.user_id, token);
                        if (!isValid) throw new InvalidUserToken();
                    }
                    return user;
                }
            }).listen(port, () => {
                this.logService.info(`HTTP service is listening on port ${port}`);
                resolve(true);
            });
        });
    }

    static isEnabled(cfg: ApplicationConfiguration): boolean {
        return cfg.rest !== null;
    }
}
