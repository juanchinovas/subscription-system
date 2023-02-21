import { IConfigProvider, IQueueConsumer, Subscription } from "@internal/common";
import { ISubscriptionNotifier } from "./interfaces/ISubscriptionNotifier";
import { IObserver } from "./interfaces/IObserver";
export declare class QueueConsumer implements IQueueConsumer<Subscription>, ISubscriptionNotifier {
    #private;
    private configProvider;
    constructor(configProvider: IConfigProvider);
    notify(subject: unknown): Promise<void>;
    registerObserver(observer: IObserver<any>): Promise<void>;
    removeObserver(observer: any): Promise<boolean>;
    consume(): Promise<void>;
    stop(): void;
    private connectQueue;
    private readMQServerConfig;
}
