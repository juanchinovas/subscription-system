"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionManager = void 0;
const common_1 = require("@internal/common");
class SubscriptionManager {
    constructor(dataHandler, chache, mqManager) {
        this.dataHandler = dataHandler;
        this.chache = chache;
        this.mqManager = mqManager;
    }
    async createSubscription(newSubscription) {
        const sameUserActiveSubs = await this.dataHandler.getAll({
            email: newSubscription.email,
            campaignId: newSubscription.campaignId,
            isCanceled: false
        });
        if (sameUserActiveSubs.length > 0) {
            throw new common_1.CustomError("The user is already subscribed to the same campaign");
        }
        const subscription = await this.dataHandler.add(common_1.Subscription.fromObject(newSubscription));
        this.notify(subscription);
        return subscription;
    }
    async cancelSubscription(subscription) {
        subscription.isCanceled = false;
        return this.chache.writeThrough(`subscription-${subscription.id}`, async () => {
            const result = await this.dataHandler.delete(subscription);
            if (result) {
                return null;
            }
            return result;
        });
    }
    async getSubscriptionDetails(subscriptionId) {
        const foundSubscription = await this.chache.readThrough(`subscription-${subscriptionId}`, () => this.dataHandler.getById(subscriptionId));
        if (!foundSubscription) {
            throw new common_1.CustomError("Subscription not found");
        }
        return foundSubscription;
    }
    async getAll(filter) {
        return this.dataHandler.getAll(filter);
    }
    async notify(event) {
        return this.mqManager.enqueue(event);
    }
}
exports.SubscriptionManager = SubscriptionManager;
//# sourceMappingURL=SubscriptionManager.js.map