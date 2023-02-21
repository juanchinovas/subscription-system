import { ConfigProvider, ICacheProvider } from "@internal/common";
import NodeCache from "node-cache";

export class InMemoryCacheManager implements ICacheProvider {
    private nodeCache: NodeCache;

    constructor(configProvider: ConfigProvider) {
        this.nodeCache = new NodeCache({ stdTTL: configProvider.readPrimitive("cacheprovider.ttl", Number) });
    }


    async writeThrough<T>(key: string, fallback: () => Promise<T | null>): Promise<T | null> {
        const newData = await fallback();
        if (newData === null || newData === undefined) {
            this.nodeCache.del(key);
            return true as T;
        } else {
            this.nodeCache.set(key, newData);
        }

        return newData as T;
    }

    async readThrough<T>(key: string, fallback: () => Promise<T>): Promise<T> {
        const cacheData = this.nodeCache.get<T>(key)
        if (cacheData) {
            return cacheData;
        }

        const newData = await fallback();
        if (newData) {
            this.nodeCache.set(key, newData);
        }
        
        return newData as T;
    }

}