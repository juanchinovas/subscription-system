"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.YmlConfigFileReader = void 0;
const common_1 = require("@internal/common");
const node_yaml_config_1 = require("node-yaml-config");
const path_1 = __importDefault(require("path"));
class YmlConfigFileReader extends common_1.ConfigLoader {
    async load() {
        const env = process.env.NODE_ENV ?? 'development';
        const rootPath = `${__dirname}/../..`;
        return (0, node_yaml_config_1.loadAsync)(path_1.default.join(rootPath, `/config/${env}-config.yml`), env);
    }
}
exports.YmlConfigFileReader = YmlConfigFileReader;
//# sourceMappingURL=YmlConfigFileReader.js.map