"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionController = void 0;
const common_1 = require("@internal/common");
class SubscriptionController {
    constructor(subscriptionManager) {
        this.subscriptionManager = subscriptionManager;
    }
    async create(req) {
        const subscription = common_1.Subscription.fromObject(req.body);
        const subsResult = await this.subscriptionManager.createSubscription(subscription);
        return common_1.Result.success(201, subsResult);
    }
    async cancel(req) {
        const { content: subscrition } = await this.getDetails(req);
        const result = await this.subscriptionManager.cancelSubscription(subscrition);
        return common_1.Result.success(result);
    }
    async getDetails(req) {
        const id = req.params.id;
        if (!id || typeof id === "boolean") {
            throw new common_1.CustomError("Should provide a valid subscription id");
        }
        const results = await this.subscriptionManager.getSubscriptionDetails(id);
        return common_1.Result.success(results);
    }
    async getAll(req) {
        const { canceled } = req?.query ?? {};
        const filter = canceled === "true" ? { isCanceled: true } : undefined;
        return common_1.Result.success(await this.subscriptionManager.getAll(filter));
    }
}
exports.SubscriptionController = SubscriptionController;
//# sourceMappingURL=controller.js.map