import {ValidationError} from "class-validator/validation/ValidationError";
import {HttpError} from "routing-controllers";
import {ApplicationStatus} from "../../rest/models/ApplicationStatus";

export class InvalidArgumentError extends HttpError {
    status: string = ApplicationStatus.INVALID_ARGUMENT;
    errors: ValidationError[] = [];
    name: string = "InvalidArgument";

    constructor(msg: string, errors: ValidationError[]) {
        super(422, msg);
        this.errors = errors;
        delete this.stack;
    }

}