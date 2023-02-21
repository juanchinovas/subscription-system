"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryCacheManager = void 0;
const node_cache_1 = __importDefault(require("node-cache"));
class InMemoryCacheManager {
    constructor(configProvider) {
        this.nodeCache = new node_cache_1.default({ stdTTL: configProvider.readPrimitive("cacheprovider.ttl", Number) });
    }
    async writeThrough(key, fallback) {
        const newData = await fallback();
        if (newData === null || newData === undefined) {
            this.nodeCache.del(key);
            return true;
        }
        else {
            this.nodeCache.set(key, newData);
        }
        return newData;
    }
    async readThrough(key, fallback) {
        const cacheData = this.nodeCache.get(key);
        if (cacheData) {
            return cacheData;
        }
        const newData = await fallback();
        if (newData) {
            this.nodeCache.set(key, newData);
        }
        return newData;
    }
}
exports.InMemoryCacheManager = InMemoryCacheManager;
//# sourceMappingURL=InMemoryCacheManager.js.map