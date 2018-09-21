import {ValidationError} from "class-validator/validation/ValidationError";
import {HttpError} from "routing-controllers";
import {ApplicationStatus} from "../../rest/models/ApplicationStatus";

export class PermissionDenied extends HttpError {
    status: string = ApplicationStatus.PERMISSION_DENIED;
    errors: ValidationError[] = [];
    name: string = "PermissionDenied";

    constructor(msg: string = "PermissionDenied") {
        super(403, msg);
        delete this.stack;
    }
}


export class InvalidUserToken extends HttpError {
    status: string = ApplicationStatus.INVALID_USER_TOKEN;
    errors: ValidationError[] = [];
    name: string = "InvalidUserToken";

    constructor(msg: string = "User Token is invalid") {
        super(401, msg);
        delete this.stack;
    }
}