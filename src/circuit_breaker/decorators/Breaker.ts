
export function breaker({}) {
    return function (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
        return descriptor;
    };
}
