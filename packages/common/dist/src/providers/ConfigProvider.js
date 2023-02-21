"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigProvider = void 0;
class ConfigProvider {
    constructor(configLoader) {
        this.configLoader = configLoader;
        this.init().catch(console.log);
    }
    read(key) {
        const keyPath = this.dotNotationToArray(key);
        return keyPath.reduce((obj, key) => obj?.[key], this.config);
    }
    readPrimitive(key, cast) {
        const keyPath = this.dotNotationToArray(key);
        const value = keyPath.reduce((obj, key) => obj?.[key], this.config);
        return cast(value);
    }
    async init() {
        this.config = this.configLoader.load();
    }
    dotNotationToArray(key) {
        return key.split(".");
    }
}
exports.ConfigProvider = ConfigProvider;
//# sourceMappingURL=ConfigProvider.js.map