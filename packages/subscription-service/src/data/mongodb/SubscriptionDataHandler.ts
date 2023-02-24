import { IConfigProvider, ILogger, Subscription } from "@internal/common";
import { MongooseDataHandler } from "./MongooseDataHandler";
import { SubscriptionModel } from "./schema";

export class SubscriptionDataHandler extends MongooseDataHandler<Subscription> {

    constructor(config: IConfigProvider, logger: ILogger) {
        super(config, SubscriptionModel, logger);
        this.connect().catch(logger.error.bind(logger));
    }

    async add(subscription: Subscription): Promise<Subscription> {
        const result = await super.add(subscription);
        return Subscription.fromObject(result);
    }
    
    async delete(subscription: Subscription): Promise<boolean> {
        await this.assertIsConnected();
        const result = await SubscriptionModel.findByIdAndUpdate(
            subscription.id,
            {
                isCanceled: true
            }
        );
        
        return Boolean(result?._id);
    }
    
    async getById(id: unknown): Promise<Subscription> {
        await this.assertIsConnected();
        const result = await SubscriptionModel.findOne({
            _id: {$eq: id}
        });

        return (result && Subscription.fromObject(result?.toJSON())) || null as unknown as Subscription;
    }
    
    async getAll(filter?: Partial<Record<keyof Subscription, unknown>> | undefined): Promise<Subscription[]> {
        const results =  await super.getAll(filter);
        return results.map( result => Subscription.fromObject(result));
    }
}
