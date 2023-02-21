import { CustomError, ICacheProvider, IDataHandler, IEnqueue, Subscription } from "@internal/common";

export class SubscriptionManager {
    constructor(
        private dataHandler: IDataHandler<Subscription>,
        private chache: ICacheProvider,
        private mqManager: IEnqueue<Subscription>) {}

    async createSubscription(newSubscription: Subscription) {
        const sameUserActiveSubs = await this.dataHandler.getAll({
            email: newSubscription.email,
            campaignId: newSubscription.campaignId,
            isCanceled: false
        });

        if (sameUserActiveSubs.length > 0) {
            throw new CustomError("The user is already subscribed to the same campaign");
        }

        const subscription = await this.dataHandler.add(Subscription.fromObject(newSubscription));
        this.notify(subscription);

        return subscription;
    }

    async cancelSubscription(subscription: Subscription) {
        subscription.isCanceled = false;
        return this.chache.writeThrough(
            `subscription-${subscription.id}`,
            async () => {
                const result = await this.dataHandler.delete(subscription)
                if (result) {
                    return null;
                }
                return result;
            }
        ) as unknown as boolean;
    }

    async getSubscriptionDetails(subscriptionId: string) {
        const foundSubscription = await this.chache.readThrough(
            `subscription-${subscriptionId}`,
            () => this.dataHandler.getById(subscriptionId)
        );
        if(!foundSubscription) {
            throw new CustomError("Subscription not found");
        }

        return foundSubscription;
    }

    async getAll(filter?: Partial<Record<keyof Subscription, unknown>>) {
        return this.dataHandler.getAll(filter);
    }

    async notify(event: Subscription) {
        return this.mqManager.enqueue(event);
    }
}