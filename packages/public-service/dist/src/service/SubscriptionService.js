"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionService = void 0;
class SubscriptionService {
    constructor(serviceRequestManager) {
        this.serviceRequestManager = serviceRequestManager;
    }
    async getAll(canceled) {
        return this.serviceRequestManager.get({
            service: "subscriptionservice",
            path: `/ap1/subscriptions${canceled ? "?canceled=true" : ""}`
        });
    }
}
exports.SubscriptionService = SubscriptionService;
//# sourceMappingURL=SubscriptionService.js.map