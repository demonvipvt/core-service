import {Validator, registerDecorator, ValidationOptions, ValidationArguments} from "class-validator";


export function IsEnum(entity: any, validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: "IsEnum",
            target: object.constructor,
            propertyName: propertyName,
            constraints: [entity],
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    return new Validator().isEnum(value, entity);
                },
                defaultMessage(args: ValidationArguments) {
                    const enumValues = Object.keys(entity).map(k => entity[k]);
                    return "$property must be a valid enum value in " + enumValues;
                }
            }
        });
    };
}