import { CustomError, Result, Subscription } from "@internal/common";
import { Request } from "express";
import { SubscriptionManager } from "../../managers/SubscriptionManager";

export class SubscriptionController {
    constructor(private subscriptionManager: SubscriptionManager) {}

    async create(req: Request): Promise<Result<Subscription>> {
        const subscription = Subscription.fromObject(req.body);
        const subsResult = await this.subscriptionManager.createSubscription(subscription);

        return Result.success(201, {
            id: subsResult.id
        } as Subscription);
    }

    async cancel(req: Request): Promise<Result<boolean>> {
        const {content: subscrition} = await this.getDetails(req);
        const result = await this.subscriptionManager.cancelSubscription(subscrition as Subscription);

        return Result.success(result); 
    }

    async getDetails(req: Request): Promise<Result<Subscription>> {
        const id = req.params.id;
        if (!id || typeof id === "boolean") {
            throw new CustomError("Should provide a valid subscription id");
        }

        const results = await this.subscriptionManager.getSubscriptionDetails(id);

        return Result.success(results)
    }

    async getAll(req: Request): Promise<Result<Subscription[]>>  {
        const {canceled} = req.query ?? {};
        let filter = undefined;
        if (canceled === "true" || canceled === "false") {
            filter = { isCanceled: Boolean(canceled === "true") };
        }

        return Result.success(
            await this.subscriptionManager.getAll(filter)
        );
    }
}
