import { Result, Subscription } from "@internal/common";
import { expect } from "chai";
import { Request } from "express";
import Sinon from "sinon";
import { SubscriptionController } from "../api/subscription/controller";
import { SubscriptionManager } from "../managers/SubscriptionManager";

describe("subscriptionController", () => {
    let subscriptionManager: Sinon.SinonStubbedInstance<SubscriptionManager>;
    let controller: SubscriptionController;

    before(() => {
        Sinon.replace(Subscription, 'fromObject', Sinon.fake.returns({} as Subscription));
        subscriptionManager = Sinon.createStubInstance(SubscriptionManager);
        controller = new SubscriptionController(subscriptionManager);
    });

    after(() => {
        Sinon.restore();
    });

    describe("create", () => {
        beforeEach(() => {
            subscriptionManager.createSubscription.resolves({}  as Subscription)
        });

        it("calls createSubscription on the subscription manager", async () => {
            const req = {body: {}} as Request;
            await controller.create(req);

            expect(subscriptionManager.createSubscription.called).to.be.true;
        });

        it("returns Result when the subscription is created", async () => {
            const req = {body: {}} as Request;
            const result: Result<Subscription> = await controller.create(req);

            expect(result).instanceOf(Result<Subscription>);
        });

        it("returns success Result with the id when the subscription is created correctly", async () => {
            subscriptionManager = Sinon.createStubInstance(SubscriptionManager, {
                createSubscription: Sinon.stub(Promise.resolve({id: 45} as unknown as Subscription))
            });
            controller = new SubscriptionController(subscriptionManager);
            const req = {body: {}} as Request;
            const result: Result<Subscription> = await controller.create(req);

            expect(result).to.be.deep.eq({
                success: true,
                code: 201,
                content: {
                    id: 45
                }
            });
        });

        it("throws when subscription creation fails", (done) => {
            const error = new Error("Oops");
            subscriptionManager = Sinon.createStubInstance(SubscriptionManager, {
                createSubscription: Sinon.stub(Promise.reject(error))
            });
            controller = new SubscriptionController(subscriptionManager);
            const req = {body: {}} as Request;
            
            controller.create(req)
            .then(done)
            .catch(thrown => {
                expect(thrown).to.be.equal(error);
                done();
            });
        });

        it("throws when subscription is invalid", (done) => {
            Sinon.restore();
            const req = {body: {}} as Request;
            
            controller.create(req)
            .then(done)
            .catch(thrown => {
                expect(thrown).instanceOf(Error);
                done();
            });
        });
    });

    describe("cancel", () => {
        const sandbox = Sinon.createSandbox();

        beforeEach(() => {
            // @ts-ignore
            sandbox.replace(Subscription, 'fromObject', Sinon.fake.returns({} as Subscription));
            subscriptionManager = Sinon.createStubInstance(SubscriptionManager);
            controller = new SubscriptionController(subscriptionManager);
            sandbox.replace(controller, 'getDetails', Sinon.fake.resolves({content: {}} as Result<Subscription>));
        })

        afterEach(() => {
            sandbox.restore();
        })

        it("calls cancelSubscription on the subscription manager", async () => {
            const req = {params: {id: 1}} as unknown as Request;
            await controller.cancel(req);

            expect(subscriptionManager.cancelSubscription.called).to.be.true;
        });

        it("returns Result when the subscription is cancel", async () => {
            const req = {params: {id: 1}} as unknown as Request;
            const result: Result<boolean> = await controller.cancel(req);

            expect(result).instanceOf(Result<boolean>);
        });

        it("returns success Result when the subscription is canceled correctly", async () => {
            subscriptionManager = Sinon.createStubInstance(SubscriptionManager, {
                cancelSubscription: Sinon.stub(Promise.resolve(true))
            });
            controller = new SubscriptionController(subscriptionManager);
            const req = {params: {id: 1}} as unknown as Request;
            const result: Result<boolean> = await controller.cancel(req);

            expect(result).to.be.deep.eq({
                success: true,
                content: true,
                code: undefined
            });
        });

        it("throws when subscription creation fails", (done) => {
            const error = new Error("Oops");
            subscriptionManager = sandbox.createStubInstance(SubscriptionManager, {
                cancelSubscription: sandbox.stub(Promise.reject(error))
            });
            controller = new SubscriptionController(subscriptionManager);
            const req = {params: {id: 1}} as unknown as Request;
            
            controller.cancel(req)
            .then(done)
            .catch(thrown => {
                expect(thrown).to.be.equal(error);
                done();
            });
        });
    });

    describe("getDetails", () => {
        const sandbox = Sinon.createSandbox();

        beforeEach(() => {
            subscriptionManager = Sinon.createStubInstance(SubscriptionManager);
            controller = new SubscriptionController(subscriptionManager);
        })

        afterEach(() => {
            sandbox.restore();
        })

        it("calls getSubscriptionDetails on the subscription manager", async () => {
            const req = {params: {id: 1}} as unknown as Request;
            await controller.getDetails(req);

            expect(subscriptionManager.getSubscriptionDetails.called).to.be.true;
        });

        it("returns Result with the subscription details", async () => {
            const req = {params: {id: 1}} as unknown as Request;
            const result: Result<Subscription> = await controller.getDetails(req);

            expect(result).instanceOf(Result<Subscription>);
        });

        it("returns success Result with the subscription details correctly", async () => {
            const req = {params: {id: 1}} as unknown as Request;
            subscriptionManager = Sinon.createStubInstance(SubscriptionManager, {
                getSubscriptionDetails: Sinon.stub(Promise.resolve({} as Subscription))
            });
            controller = new SubscriptionController(subscriptionManager);

            const result: Result<Subscription> = await controller.getDetails(req);

            expect(result).to.be.deep.eq({
                success: true,
                content: {},
                code: undefined
            });
        });

        it("throws if subscription manager throws", (done) => {
            const error = new Error("Oops");
            subscriptionManager = sandbox.createStubInstance(SubscriptionManager, {
                getSubscriptionDetails: sandbox.stub(Promise.reject(error))
            });
            controller = new SubscriptionController(subscriptionManager);
            const req = {params: {id: 1}} as unknown as Request;
            
            controller.cancel(req)
            .then(done)
            .catch(thrown => {
                expect(thrown).to.be.equal(error);
                done();
            });
        });

        [0, "", null, undefined, NaN, false].forEach(value => {
            it(`throws if subscription id is '${value}'`, (done) => {
                const error = Error("Should provide a valid subscription id");
                const req = {params: {id: value}} as unknown as Request;
                
                controller.getDetails(req)
                .then(done)
                .catch(thrown => {
                    expect(thrown).to.be.deep.equal(error);
                    done();
                });
            });
        });

        it(`throws if subscription id is 'true'`, (done) => {
            const error = Error("Should provide a valid subscription id");
            const req = {params: {id: true}} as unknown as Request;
            
            controller.getDetails(req)
            .then(done)
            .catch(thrown => {
                expect(thrown).to.be.deep.equal(error);
                done();
            });
        });
    });

    describe("getAll", () => {
        const sandbox = Sinon.createSandbox();

        beforeEach(() => {
            subscriptionManager = Sinon.createStubInstance(SubscriptionManager);
            controller = new SubscriptionController(subscriptionManager);
        })

        afterEach(() => {
            sandbox.restore();
        })

        it("calls getAll on the subscription manager", async () => {
            await controller.getAll({} as unknown as Request);

            expect(subscriptionManager.getAll.called).to.be.true;
        });

        it("returns Result with the all subscriptions", async () => {
            const result: Result<Subscription[]> = await controller.getAll({} as unknown as Request);

            expect(result).instanceOf(Result<Subscription[]>);
        });

        it("returns success Result with a list of subscription", async () => {
            subscriptionManager = Sinon.createStubInstance(SubscriptionManager, {
                getAll: Sinon.stub(Promise.resolve([]))
            });
            controller = new SubscriptionController(subscriptionManager);

            const result: Result<Subscription[]> = await controller.getAll({} as unknown as Request);

            expect(result).to.be.deep.eq({
                success: true,
                content: [],
                code: undefined
            });
        });

        it("throws if subscription manager throws", (done) => {
            const error = new Error("Oops");
            subscriptionManager = sandbox.createStubInstance(SubscriptionManager, {
                getAll: sandbox.stub(Promise.reject(error))
            });
            controller = new SubscriptionController(subscriptionManager);
            
            controller.getAll({} as unknown as Request)
            .then(done)
            .catch(thrown => {
                expect(thrown).to.be.deep.equal(error);
                done();
            });
        });
    });
});