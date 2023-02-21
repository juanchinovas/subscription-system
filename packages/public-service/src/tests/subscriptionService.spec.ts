import { Subscription } from "@internal/common";
import { expect } from "chai";
import Sinon from "sinon";
import { ServiceRequestManager } from "../service/ServiceRequestManager";
import { SubscriptionService } from "../service/SubscriptionService";

describe("SubscriptionService", () => {
    let mockServiceRequestManager: Sinon.SinonStubbedInstance<ServiceRequestManager>;
    let service: SubscriptionService;

    beforeEach(() => {
        mockServiceRequestManager = Sinon.createStubInstance(ServiceRequestManager);
        service = new SubscriptionService(mockServiceRequestManager);
    });

    it("should start a request to /api/subscriptions on the subscription service", () => {
        service.getAll(false);
        expect(mockServiceRequestManager.get.calledOnceWith({
            service: "subscriptionservice",
            path: `/api/subscriptions`
        })).to.be.true;
    });

    it("should start a request to /api/subscriptions on the subscription service to get canceled subscriptions", () => {
        service.getAll(true);
        expect(mockServiceRequestManager.get.calledOnceWith({
            service: "subscriptionservice",
            path: `/api/subscriptions?canceled=true`
        })).to.be.true;
    });

    it("should start a request to /api/subscriptions/:id on the subscription service to get subscription details", () => {
        service.getById("15");
        expect(mockServiceRequestManager.get.calledOnceWith({
            service: "subscriptionservice",
            path: "/api/subscriptions/15"
        })).to.be.true;
    });

    it("should start a request to /api/subscriptions/:id on the subscription service to cancel a subscription", () => {
        service.cancel("12");
        expect(mockServiceRequestManager.delete.calledOnceWith({
            service: "subscriptionservice",
            path: `/api/subscriptions/12`
        })).to.be.true;
    });

    it("should start a request to /api/subscriptions on the subscription service to create a subscription", () => {
        service.create({} as Subscription);
        expect(mockServiceRequestManager.post.calledOnceWith({
            service: "subscriptionservice",
            path: `/api/subscriptions`,
            data: {}
        })).to.be.true;
    });

    afterEach(() => {
        Sinon.restore();
    })

});