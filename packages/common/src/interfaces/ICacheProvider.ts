export interface ICacheProvider {
    readThrough<T>(key: string, fallback: () => Promise<T>, ttl?: number): Promise<T>;
    writeThrough<T>(key: string, fallback: () => Promise<T | null>, ttl?: number): Promise<T | null>;
}