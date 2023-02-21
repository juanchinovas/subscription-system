import { ConfigProvider, ICacheProvider } from "@internal/common";
export declare class InMemoryCacheManager implements ICacheProvider {
    private nodeCache;
    constructor(configProvider: ConfigProvider);
    writeThrough<T>(key: string, fallback: () => Promise<T | null>): Promise<T | null>;
    readThrough<T>(key: string, fallback: () => Promise<T>): Promise<T>;
}
