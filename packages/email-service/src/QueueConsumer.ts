import { Channel, Connection, connect, ConsumeMessage } from "amqplib";
import { CustomError, IConfigProvider, IQueueConsumer, Subscription } from "@internal/common";
import { ISubscriptionNotifier } from "./interfaces/ISubscriptionNotifier";
import { IObserver } from "./interfaces/IObserver";

declare type QueueConfig = {
    host: string;
    port: number;
    queue: string;
    user: string;
    pass: string;
};

export class QueueConsumer implements IQueueConsumer, ISubscriptionNotifier {
    #queueConfig: QueueConfig;
    #observers: Array<IObserver<any>>;
    #mqConnetion: Connection | undefined;
    #mqChannel: Channel | undefined;

    constructor(private configProvider: IConfigProvider) {
        this.#observers = [];
        this.readMQServerConfig();
    }

    async notify(subject: unknown): Promise<void> {
        this.#observers.forEach(observer => observer.notify(subject));
    }
    
    async registerObserver(observer: IObserver<any>): Promise<void> {
        this.#observers.push(observer);
    }

    async removeObserver(observer: any): Promise<boolean> {
        const index = this.#observers.findIndex(ob => ob === observer);
        if (index > -1) {
            this.#observers.splice(index, 1);
            return true;
        }

        return false;
    }

    async consume(): Promise<void> {
        [this.#mqConnetion, this.#mqChannel] = (await this.connectQueue()) ?? [];
        if (!this.#mqConnetion || !this.#mqChannel) {
            throw new CustomError("Unable to connect to the mq server");
        }
        
        this.#mqChannel.consume(this.#queueConfig.queue, (message) => {
            try {
                const notificaion = JSON.parse(message?.content?.toString() as string);
                const subscription = Subscription.fromObject(notificaion);
                this.notify(subscription);
                this.#mqChannel?.ack(message as ConsumeMessage);
            } catch {}
        });
    }

    stop() {
        this.#mqChannel?.close();
        this.#mqConnetion?.close();
    }

    private async connectQueue() {   
        try {
            if (!this.#queueConfig) {
                this.readMQServerConfig();
            }

            const connection = await connect(`amqp://${this.#queueConfig.user}:${this.#queueConfig.pass}@${this.#queueConfig.host}:${this.#queueConfig.port}`);
            const channel    = await connection.createChannel()
            await channel.assertQueue(this.#queueConfig.queue);
            console.log("Rabbit connected true");
            return [connection, channel] as [Connection, Channel];
            
        } catch {}
    }

    private readMQServerConfig() {
        const config = this.#queueConfig ?? this.configProvider.read<QueueConfig>("mqmanager");
        this.#queueConfig = config;
    }
}