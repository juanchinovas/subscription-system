import { ServiceRequestManager } from "../ServiceRequestManager";

export class SubscriptionService {
    constructor(private serviceRequestManager: ServiceRequestManager) {}

    async getAll(canceled: boolean) {
        return this.serviceRequestManager.get({
            service: "subscriptionservice",
            path: `/ap1/subscriptions${canceled ? "?canceled=true" : ""}`
        });
    }
}