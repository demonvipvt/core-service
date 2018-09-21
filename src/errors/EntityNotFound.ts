import {ValidationError} from "class-validator/validation/ValidationError";
import {HttpError} from "routing-controllers";
import {ApplicationStatus} from "../rest/models";

export class EntityNotFound extends HttpError {
    status: string = ApplicationStatus.ENTITY_NOT_FOUND;
    errors: ValidationError[] = [];
    name: string = ApplicationStatus.ENTITY_NOT_FOUND;

    constructor(msg: string = "Entity is not found", errors: ValidationError[] = null) {
        super(422, msg);
        this.errors = errors;
        delete this.stack;
    }

}