import { CustomError, Result, Subscription } from "@internal/common";
import { Request } from "express";
import { SubscriptionService } from "../../service/SubscriptionService";

export class SubscriptionController {
    constructor(private subscriptionService: SubscriptionService) {}

    async create(req: Request): Promise<Result<Subscription>> {
        const subscription = Subscription.fromObject(req.body);
        return this.subscriptionService.create(subscription);
    }

    async cancel(req: Request): Promise<Result<boolean>> {
        const {content: subscrition} = await this.getDetails(req);
        return this.subscriptionService.cancel(subscrition?.id as string);
    }

    async getDetails(req: Request): Promise<Result<Subscription>> {
        const id = req.params.id;
        if (!id || typeof id === "boolean") {
            throw new CustomError("Should provide a valid subscription id");
        }

        return await this.subscriptionService.getById(id);
    }

    async getAll(req: Request): Promise<Result<Subscription[]>>  {
        const {canceled} = req.query;
        return this.subscriptionService.getAll(canceled);
    }
}
