import { ConfigLoader } from "@internal/common";
import { load as ymlLoad } from "node-yaml-config";
import path from "path";

export class YmlConfigFileReader extends ConfigLoader {

    load(): Record<string, unknown> {
        const env = process.env.NODE_ENV ?? 'development';
        const rootPath = `${__dirname}/../..`;
        return ymlLoad(path.join(rootPath,`/config/${env}-config.yml`), env);
    }
}
