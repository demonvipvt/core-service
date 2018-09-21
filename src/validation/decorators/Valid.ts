import {validate} from "../validate";

const VALIDATE_META_KEY = Symbol("validate");

export function validation() {
    return function (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = async function (...args: any[]) {
            const indexes: number[] = Reflect.getOwnMetadata(VALIDATE_META_KEY, target, propertyKey);
            if (indexes) {
                for (let index of indexes) {
                    await validate(args[index]);
                }
            }

            return await originalMethod.apply(this, args);
        };
        return descriptor;
    };
}


export function valid() {
    return function (target: any, propertyKey: string | symbol, index: number) {
        const existingRequiredParameters: number[] = Reflect.getOwnMetadata(VALIDATE_META_KEY, target, propertyKey) || [];
        existingRequiredParameters.push(index);
        Reflect.defineMetadata(VALIDATE_META_KEY, existingRequiredParameters, target, propertyKey);
    };
}