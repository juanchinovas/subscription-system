export interface ILogger {
    log(msg: unknown): void;
    error(msg: unknown): void;
}