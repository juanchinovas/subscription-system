export abstract class ConfigLoader {
    load(): Record<string, unknown> {
        return process.env;
    }
}