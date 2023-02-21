import { IConfigProvider, Subscription } from "@internal/common";
import { MongooseDataHandler } from "./MongooseDataHandler";
export declare class SubscriptionDataHandler extends MongooseDataHandler<Subscription> {
    constructor(config: IConfigProvider);
    add(subscription: Subscription): Promise<Subscription>;
    delete(subscription: Subscription): Promise<boolean>;
    getById(id: unknown): Promise<Subscription>;
    getAll(filter?: Partial<Record<keyof Subscription, unknown>> | undefined): Promise<Subscription[]>;
}
