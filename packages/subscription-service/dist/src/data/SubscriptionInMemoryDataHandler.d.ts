import { IDataHandler, Subscription } from "@internal/common";
export declare class SubscriptionInMemoryDataHandler implements IDataHandler<Subscription> {
    private db;
    constructor();
    add(subscription: Subscription): Promise<Subscription>;
    delete(subscription: Subscription): Promise<boolean>;
    getById(id: unknown): Promise<Subscription>;
    getAll(filter?: Partial<Record<keyof Subscription, unknown>> | undefined): Promise<Subscription[]>;
}
