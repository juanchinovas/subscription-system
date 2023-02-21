import { IConfigProvider, IEnqueue, Subscription } from "@internal/common";
export declare class QueueManager implements IEnqueue<Subscription> {
    #private;
    private configProvider;
    constructor(configProvider: IConfigProvider);
    enqueue(suscription: Subscription): Promise<boolean>;
    private connectQueue;
    private readMQServerConfig;
}
