import { CustomError, Result, Subscription } from "@internal/common";
import { Request } from "express";
import { SubscriptionService } from "../../service/SubscriptionService";

export class SubscriptionController {
    constructor(private subscriptionService: SubscriptionService) {}

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

    async getAll(req: Request): Promise<Result<Subscription[]>>  {
        const {canceled} = req.query;
        return Result.success(
            await this.subscriptionService.getAll(canceled === "true")
        );
    }
}
