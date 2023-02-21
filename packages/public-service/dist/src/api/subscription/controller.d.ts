import { Result, Subscription } from "@internal/common";
import { Request } from "express";
import { SubscriptionService } from "../../service/SubscriptionService";
export declare class SubscriptionController {
    private subscriptionService;
    constructor(subscriptionService: SubscriptionService);
    getAll(req: Request): Promise<Result<Subscription[]>>;
}
