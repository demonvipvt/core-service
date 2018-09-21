import {ValidationError} from "class-validator/validation/ValidationError";
import {HttpError} from "routing-controllers";
import {ApplicationStatus} from "../rest/models";

export class InternalError extends HttpError {
    status: string = ApplicationStatus.INTERNAL_ERROR;
    errors: ValidationError[] = [];
    name: string = ApplicationStatus.INTERNAL_ERROR;

    constructor(msg: string = "Internal server error", errors: ValidationError[] = null) {
        super(422, msg);
        this.errors = errors;
        delete this.stack;
    }

}