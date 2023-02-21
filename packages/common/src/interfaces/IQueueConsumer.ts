export interface IQueueConsumer {
    consume(): Promise<void>;
}