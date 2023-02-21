type SimpleType = string | number | boolean;
export interface CastConstructor<T extends SimpleType> {
    (value: unknown): T;
}
export interface IConfigProvider {
    readPrimitive<T extends SimpleType>(key: string, cast: CastConstructor<T>): T;
    read<T>(key: string): T;
}
export {};
