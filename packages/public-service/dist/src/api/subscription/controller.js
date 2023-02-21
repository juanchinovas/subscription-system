"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionController = void 0;
const common_1 = require("@internal/common");
class SubscriptionController {
    constructor(subscriptionService) {
        this.subscriptionService = subscriptionService;
    }
    // async create(req: Request): Promise<Result<Subscription>> {
    //     const subscription = Subscription.fromObject(req.body);
    //     const subsResult = await this.subscriptionManager.createSubscription(subscription);
    //     return Result.success(201, subsResult);
    // }
    // async cancel(req: Request): Promise<Result<boolean>> {
    //     const {content: subscrition} = await this.getDetails(req);
    //     const result = await this.subscriptionManager.cancelSubscription(subscrition!);
    //     return Result.success(result); 
    // }
    // async getDetails(req: Request): Promise<Result<Subscription>> {
    //     const id = req.params.id;
    //     if (!id || typeof id === "boolean") {
    //         throw new CustomError("Should provide a valid subscription id");
    //     }
    //     const results = await this.subscriptionManager.getSubscriptionDetails(id);
    //     return Result.success(results)
    // }
    async getAll(req) {
        const { canceled } = req.query;
        return common_1.Result.success(await this.subscriptionService.getAll(canceled === "true"));
    }
}
exports.SubscriptionController = SubscriptionController;
//# sourceMappingURL=controller.js.map