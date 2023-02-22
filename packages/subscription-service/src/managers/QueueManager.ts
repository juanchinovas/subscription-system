import { Channel, Connection, connect } from "amqplib";
import { IConfigProvider, IEnqueue, ILogger, Subscription } from "@internal/common";

declare type QueueConfig = {
    host: string;
    port: number;
    queue: string;
    user: string;
    pass: string;
};

export class QueueManager implements IEnqueue<Subscription> {
    #queueConfig: QueueConfig;

    constructor(private configProvider: IConfigProvider, private logger: ILogger) {}

    async enqueue(suscription: Subscription): Promise<boolean> {
        const [connection, channel] = (await this.connectQueue()) ?? [];
        if (!connection || !channel) {
            return false;
        }
        
        const result = channel.sendToQueue(
            this.#queueConfig.queue,
            Buffer.from(JSON.stringify(suscription))
        );

        await channel.close();
        await connection.close();

        return result;
    }

    private async connectQueue() {   
        try {
            if (!this.#queueConfig) {
                this.readMQServerConfig();
            }

            const connection = await connect(`amqp://${this.#queueConfig.user}:${this.#queueConfig.pass}@${this.#queueConfig.host}:${this.#queueConfig.port}`);
            const channel    = await connection.createChannel()
            await channel.assertQueue(this.#queueConfig.queue);
            this.logger.log("Rabbit connected true");
            return [connection, channel] as [Connection, Channel];
            
        } catch (error) {
            this.logger.error({ message: "Unable to stablish connection with mq server", error })
        }
    }

    private readMQServerConfig() {
        const config = this.configProvider.read<QueueConfig>("mqmanager");
        this.#queueConfig = config;
    }
}