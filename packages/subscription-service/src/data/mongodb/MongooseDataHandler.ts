import { CustomError, IConfigProvider, IDataHandler, ILogger } from "@internal/common";
import { connect, Schema, model } from "mongoose";

declare type DbConfig = {
    host: string;
    port: number;
    db: string;
    user: string;
    pass: string;
    timeout: number;
};

export type MongooseModelType<T> = ReturnType< typeof model<Schema<T>> >;

export abstract class MongooseDataHandler<T> implements IDataHandler<T> {
    protected isConnected = false;
    private retries = 0;

    constructor(
        private config: IConfigProvider,
        protected MongooseModel: MongooseModelType<T>,
        private logger: ILogger
    ) {
        this.retries = config.readPrimitive("server.retries", Number) ?? 2;
    }

    async add(t: T): Promise<T> {
        await this.assertIsConnected();
        const newT = new this.MongooseModel(t)
        return (await newT.save()).toJSON() as T;
    }
    
    async getAll(filter?: Partial<Record<keyof T, unknown>> | undefined): Promise<T[]> {
        await this.assertIsConnected();

        let filterBy = {};
        if (filter) {
            const keys = Object.keys(filter) as Array<keyof T>;
            filterBy = keys.reduce((query, key) => {
                query.$and.push({[key]: {$eq: filter[key]}});
                return query;
            }, {$and: []} as {$and: unknown[]});
        }

        return this.MongooseModel.find(filterBy);
    }
    
    abstract delete(t: T): Promise<boolean>;
    
    abstract getById(id: unknown): Promise<T>;

    protected async connect() {
        const dbConfigInfo = this.config.read<DbConfig>("database");
        const {connection} = await connect(
            `mongodb://${dbConfigInfo.user}:${dbConfigInfo.pass}@${dbConfigInfo.host}:${dbConfigInfo.port}`,
            { 
                dbName: dbConfigInfo.db,
                serverSelectionTimeoutMS: dbConfigInfo.timeout
            }
        );
        this.isConnected = Boolean(connection.readyState === 1);
        this.logger.log(`mongodb connected ${this.isConnected}`);
    }

    protected async assertIsConnected() {
        if (!this.isConnected) {
            if (this.retries > 0) {
                this.retries -= 1;
                try {
                    await this.connect();
                    // Connection stablished
                    if (this.isConnected) {
                        return;
                    }
                } catch (error) {
                    this.logger.log({message: `Trying stablish db connection. ${this.retries} tries left`, error})
                }
            }

            throw new CustomError({
                message: `Connection to db is not stablished`
            })
        }
    }

}