import { ConfigLoader } from "@internal/common";
export declare class YmlConfigFileReader extends ConfigLoader {
    load(): Promise<Record<string, unknown>>;
}
