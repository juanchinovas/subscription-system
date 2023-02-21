import { ICacheProvider, IDataHandler, Subscription } from "@internal/common";
import { expect } from "chai";
import Sinon from "sinon";
import { SubscriptionManager } from "../managers/SubscriptionManager";

describe("SubscriptionManager", () => {
    let dataManager: SubscriptionManager;
    const subscription = Subscription.fromObject({
        campaignId: 2,
        consentFlag: 1,
        dateOfBirth: new Date(1990,1,1),
        email: "test@te.com"
    });
    let dataHandlerMocked: {
        add: Sinon.SinonSpy,
        delete: Sinon.SinonSpy,
        getById: Sinon.SinonSpy,
        getAll: Sinon.SinonSpy
    };

    beforeEach(() => {
        dataHandlerMocked =  ({
            add: Sinon.fake.resolves(subscription),
            delete: Sinon.fake.resolves(true),
            getById: Sinon.fake.resolves(subscription),
            getAll: Sinon.fake.resolves([])
        });
        const cacheManage = {
            readThrough: (_: string, fallback: () => Promise<Subscription>) => fallback(),
            writeThrough: (_: string, fallback: () => Promise<Subscription>) => fallback().then(result => {
                if (result === null) {
                    return true;
                }

                return result;
            })
        }
        const queueManager = {
            enqueue: Sinon.fake.resolves(true)
        };
        dataManager = new SubscriptionManager(
            dataHandlerMocked as unknown as IDataHandler<Subscription>,
            cacheManage as unknown as ICacheProvider,
            queueManager);
    });

    describe("createSubscription", () => {
        it("should create the subscription correctly", async () => {
            dataHandlerMocked.add = Sinon.fake.resolves(subscription);
            const result = await dataManager.createSubscription(subscription);
            expect(result).instanceOf(Subscription);
        });

        it("calls dataHandler.getAll when create a new subscription", async () => {
            await dataManager.createSubscription({
                campaignId: 2,
                consentFlag: 1,
                dateOfBirth: "2000-05-26",
                email: "test@te.com"
            });
            
            dataHandlerMocked.getAll.calledWith([{
                email: "test@te.com",
                campaignId: 1,
                status: true
            }]);
        });

        it("throws when there is a subscription with same email and campaign", () => {
            dataHandlerMocked.getAll = Sinon.fake.resolves([subscription]);
            return dataManager.createSubscription(subscription)
            .catch(error => {
                expect(error).to.have.property("message", "The user is already subscribed to the same campaign");
            });
        });

        it("throws when the subscription don't have the required parameter", () => {
            return dataManager.createSubscription({
                ...subscription,
                email: null as unknown as string
            })
            .catch(error => {
                expect(error).to.have.property("message", "Invalid Subscription paramters");
            });
        });
    });

    describe("cancelSubscription", () => {
        it("should cancel the subscription correctly", async () => {
            dataHandlerMocked.getById = Sinon.fake.resolves(subscription);
            const result = await dataManager.cancelSubscription(subscription);
            expect(result).to.be.true;
        });

        it("throws when subscription id is not found", () => {
            dataHandlerMocked.getById = Sinon.fake.resolves(subscription);
            return dataManager.cancelSubscription(subscription)
            .catch(error => {
                expect(error).to.instanceOf(Error);
                expect(error).to.have.property("message", "Subscription not found");
            })
        });

        it("returns false if fail the cancel operantion", async () => {
            dataHandlerMocked.delete = Sinon.fake.resolves(false);
            expect(await dataManager.cancelSubscription(subscription)).to.be.false;
        });
    });

    describe("getSubscriptionDetails", () => {
        it("returns subscription details correctly", async () => {
            dataHandlerMocked.getById = Sinon.fake.resolves(subscription);
            const result = await dataManager.getSubscriptionDetails('1');
            expect(result).to.be.equal(subscription);
        });

        it("throws when subscription id is not found", () => {
            dataHandlerMocked.getById = Sinon.fake.resolves(undefined);
            return dataManager.getSubscriptionDetails('2')
            .catch(error => {
                expect(error).to.instanceOf(Error);
                expect(error).to.have.property("message", "Subscription not found");
            })
        });
    });

    describe("getAll", () => {
        it("returns all subscriptions correctly", async () => {
            dataHandlerMocked.getAll = Sinon.fake.resolves([subscription]);
            const results = await dataManager.getAll();
            expect(results).instanceOf(Array);
            expect(results).to.be.deep.eq([subscription]);
        });

        it("returns empty array if not subscription", async () => {
            dataHandlerMocked.getAll = Sinon.fake.resolves([]);
            const results = await dataManager.getAll();
            expect(results).instanceOf(Array);
            expect(results.length).to.be.equal(0);
        });
    });
});