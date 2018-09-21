export function authorized(permissions: string[] = []) {
    return function (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = async function (...args: any[]) {
            return await originalMethod.apply(this, args);
        };
        return descriptor;
    };
};