import { ConfigLoader, CastConstructor, IConfigProvider } from "../../";

export class ConfigProvider implements IConfigProvider {
    private config: Record<string, unknown>;

    constructor(private configLoader: ConfigLoader) {
        this.init().catch(console.log);
    }

    read<T>(key: string): T {
        const keyPath = this.dotNotationToArray(key);
        return keyPath.reduce(
            (obj, key) => (obj as any)?.[key],
            this.config
        ) as T;
    }

    readPrimitive<T extends string | number | boolean>(key: string, cast: CastConstructor<T>): T {
        const keyPath = this.dotNotationToArray(key);
        const value = keyPath.reduce(
            (obj, key) => (obj as any)?.[key],
            this.config
        );

        return cast(value)
    }

    private async init() {
        this.config = this.configLoader.load();
    }

    private dotNotationToArray(key: string) {
        return key.split(".");
    }
}