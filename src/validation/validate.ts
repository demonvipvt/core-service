import {validate as classValidate, ValidationError} from "class-validator";

import {flatten, map} from "lodash";
import {InvalidArgumentError} from "./errors/InvalidArgumentError";

interface ValidationErr {
    field: string;
    code: string;
    message: string;
}

function errorCodeMap(type: string, field: string): string {
    switch (type) {
        case "isEnum":
            return "INVALID_" + field.toUpperCase();
    }
}

function errorConvert(errors: ValidationError[]): ValidationErr[] {
    return flatten(errors.map((error: ValidationError): ValidationErr[] => {
        const field = error.property;
        return map(error.constraints, ((message: string, type: string): ValidationErr => ({
            field,
            code: errorCodeMap(type, field),
            message
        })));
    }));
}


export async function validate(obj: any) {
    const errors = (await classValidate(obj)) as ValidationError[];
    if (errors.length > 0) {
        throw new InvalidArgumentError("Validation Error", errorConvert(errors) as any);
    }
}