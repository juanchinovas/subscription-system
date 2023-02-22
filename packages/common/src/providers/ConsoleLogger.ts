import {ILogger} from "../interfaces/ILogger";

export class ConsoleLogger implements ILogger {
    log(msg: unknown): void {
        console.log(msg);
    }
    error(error: unknown): void {
        console.error(error);
    }
}