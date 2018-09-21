import {Service} from "../../../../ioc";
import {LogService} from "../../../../log";
import {RestClient} from "../../../client_service_core";
import {AuthClientService} from "../../AuthClientService";
import {AuthUser} from "../../../../security/AuthUser";
import {breaker} from "../../../../circuit_breaker";

const jwt = require("jsonwebtoken");
const TOKEN_SECRET = "b5c2d8012abf0b708c18a1d1b9eb0af84d5450ba31362a18204b96c0e9ae6f55d8cc5aa30d1e56fd5fe2753114752d8750834dd48e03050a3c667b1737aea9b4";

@Service()
export class AuthClient extends RestClient {
    constructor(logService: LogService, authClientService: AuthClientService) {
        super("/auth", logService, authClientService);

    }

    verifyTokenFallback = () => {
        return false;
    };

    @breaker({fallback: this.verifyTokenFallback})
    async verifyToken(userId: string, token: string): Promise<boolean> {
        return (await this.post(`/token_verify`, {
            body: {
                token,
                user_id: userId
            }
        })) as any;
    }

    getUser(token: string): AuthUser {
        if (!token) return null;

        try {
            return new AuthUser(jwt.verify(token, TOKEN_SECRET).data);
        } catch (err) {
            this.logService.error(err.stack);
            return null;
        }
    }
}
