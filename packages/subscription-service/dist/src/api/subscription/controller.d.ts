import { Result, Subscription } from "@internal/common";
import { Request } from "express";
import { SubscriptionManager } from "../../managers/SubscriptionManager";
export declare class SubscriptionController {
    private subscriptionManager;
    constructor(subscriptionManager: SubscriptionManager);
    create(req: Request): Promise<Result<Subscription>>;
    cancel(req: Request): Promise<Result<boolean>>;
    getDetails(req: Request): Promise<Result<Subscription>>;
    getAll(req: Request): Promise<Result<Subscription[]>>;
}
