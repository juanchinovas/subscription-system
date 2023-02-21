import { ConfigLoader, CastConstructor, IConfigProvider } from "../../";
export declare class ConfigProvider implements IConfigProvider {
    private configLoader;
    private config;
    constructor(configLoader: ConfigLoader);
    read<T>(key: string): T;
    readPrimitive<T extends string | number | boolean>(key: string, cast: CastConstructor<T>): T;
    private init;
    private dotNotationToArray;
}
