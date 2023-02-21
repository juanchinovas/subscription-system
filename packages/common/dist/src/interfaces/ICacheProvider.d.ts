export interface ICacheProvider {
    readThrough<T>(key: string, fallback: () => Promise<T>): Promise<T>;
    writeThrough<T>(key: string, fallback: () => Promise<T | null>): Promise<T | null>;
}
