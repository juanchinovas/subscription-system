import { ICacheProvider, IDataHandler, IEnqueue, Subscription } from "@internal/common";
export declare class SubscriptionManager {
    private dataHandler;
    private chache;
    private mqManager;
    constructor(dataHandler: IDataHandler<Subscription>, chache: ICacheProvider, mqManager: IEnqueue<Subscription>);
    createSubscription(newSubscription: Subscription): Promise<Subscription>;
    cancelSubscription(subscription: Subscription): Promise<boolean>;
    getSubscriptionDetails(subscriptionId: string): Promise<Subscription>;
    getAll(filter?: Partial<Record<keyof Subscription, unknown>>): Promise<Subscription[]>;
    notify(event: Subscription): Promise<boolean>;
}
