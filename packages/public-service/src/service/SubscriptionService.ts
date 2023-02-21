import { Subscription } from "@internal/common";
import { ServiceRequestManager } from "./ServiceRequestManager";

export class SubscriptionService {
    constructor(private serviceRequestManager: ServiceRequestManager) {}

    async getAll(canceled: boolean) {
        return this.serviceRequestManager.get({
            service: "subscriptionservice",
            path: `/api/subscriptions${canceled ? "?canceled=true" : ""}`
        });
    }

    async getById(id: unknown) {
        return this.serviceRequestManager.get({
            service: "subscriptionservice",
            path: `/api/subscriptions/${id}`
        });
    }

    async create(subscription: Subscription) {
        return this.serviceRequestManager.post({
            service: "subscriptionservice",
            path: `/api/subscriptions`,
            data: subscription as unknown as Record<string, unknown>
        });
    }

    async cancel(id: unknown) {
        return this.serviceRequestManager.delete({
            service: "subscriptionservice",
            path: `/api/subscriptions/${id}`
        });
    }
}