import { IConfigProvider, IDataHandler } from "@internal/common";
import { Schema, model } from "mongoose";
type MongooseModelType<T> = ReturnType<typeof model<Schema<T>>>;
export declare abstract class MongooseDataHandler<T> implements IDataHandler<T> {
    private config;
    protected MongooseModel: MongooseModelType<T>;
    protected isConnected: boolean;
    constructor(config: IConfigProvider, MongooseModel: MongooseModelType<T>);
    add(t: T): Promise<T>;
    getAll(filter?: Partial<Record<keyof T, unknown>> | undefined): Promise<T[]>;
    abstract delete(t: T): Promise<boolean>;
    abstract getById(id: unknown): Promise<T>;
    protected connect(): Promise<void>;
    protected assertIsConnected(): void;
}
export {};
