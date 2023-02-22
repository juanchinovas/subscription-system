import { CustomError, Result, Subscription } from "@internal/common";
import { expect } from "chai";
import { Request } from "express";
import Sinon from "sinon";
import { SubscriptionService } from "../service/SubscriptionService";
import { SubscriptionController } from "../api/subscription/controller";

describe("Controller", () => {
    let subscriptionService: {
        getAll: Sinon.SinonStub,
        getById: Sinon.SinonStub,
        create: Sinon.SinonStub,
        cancel: Sinon.SinonStub,
    };
    let controller: SubscriptionController;

    beforeEach(() => {
        Sinon.replace(Subscription, 'fromObject', Sinon.fake.returns({} as Subscription));
        subscriptionService = {
            getAll: Sinon.stub().resolves(Result.success([{}])),
            getById: Sinon.stub().resolves(Result.success({})),
            create: Sinon.stub().resolves(Result.success(201, {})),
            cancel: Sinon.stub().resolves(Result.success(true))
        };
        controller = new SubscriptionController(subscriptionService as unknown as SubscriptionService);
    });

    afterEach(() => {
        Sinon.restore();
    });

    describe("create", () => {
        it("calls create on the subscription service", async () => {
            const req = {body: {}} as Request;
            await controller.create(req);
            expect(subscriptionService.create.called).to.be.true;
        });

        it("returns Result when the subscription is created", async () => {
            const req = {body: {}} as Request;
            const result: Result<Subscription> = await controller.create(req);
            expect(result).instanceOf(Result<Subscription>);
        });

        it("returns success Result when the subscription is created correctly", async () => {
            const req = {body: {}} as Request;
            const result: Result<Subscription> = await controller.create(req);

            expect(result).to.be.deep.eq({
                success: true,
                code: 201,
                content: {}
            });
        });

        it("throws when subscription creation fails", (done) => {
            const error = new Error("Oops");
            subscriptionService.create.rejects(error);
            const req = {body: {}} as Request;
            
            controller.create(req)
            .then(done)
            .catch(thrown => {
                expect(thrown).to.be.equal(error);
                done();
            });
        });

        it("throws when subscription is invalid", (done) => {
            const error = new DOMException("Oops");
            subscriptionService.create.throws(error);
            const req = {body: {}} as Request;
            
            controller.create(req)
            .then(done)
            .catch(thrown => {
                expect(thrown).to.be.equal(error);
                done();
            });
        });
    });

    describe("cancel", () => {
        it("calls cancel on the subscription service", async () => {
            const req = {params: {id: 1}} as unknown as Request;
            await controller.cancel(req);
            expect(subscriptionService.cancel.called).to.be.true;
        });

        it("returns Result when the subscription is cancel", async () => {
            const req = {params: {id: 1}} as unknown as Request;
            const result: Result<boolean> = await controller.cancel(req);
            expect(result).instanceOf(Result<boolean>);
        });

        it("returns success Result when the subscription is cancel correctly", async () => {
            const req = {params: {id: 1}} as unknown as Request;
            const result: Result<boolean> = await controller.cancel(req);

            expect(result).to.be.deep.eq({
                success: true,
                content: true,
                code: undefined
            });
        });

        it("throws when subscription id is invalid", (done) => {
            const req = {params: {id: null}} as unknown as Request;
            controller.cancel(req)
            .then(()=>done("wrong"))
            .catch((thrown: Error) => {
                expect(thrown.message).to.be.equal("Should provide a valid subscription id");
                done();
            });
        });

        it("throws when subscription service is down", (done) => {
            const error = new Error("Oops");
            subscriptionService.cancel.throws(error);
            const req = {params: {id: 1}} as unknown as Request;
            controller.cancel(req)
            .then(()=>done("wrong"))
            .catch(thrown => {
                expect(thrown).to.be.equal(error);
                done();
            });
        });
    });

    describe("getAll", () => {
        it("calls getAll on the subscription service", async () => {
            const req = {query: {}} as Request;
            await controller.getAll(req);
            expect(subscriptionService.getAll.called).to.be.true;
        });

        it("returns Result of list of subscriptions", async () => {
            const req = {query: {}} as Request;
            const result: Result<Subscription[]> = await controller.getAll(req);
            expect(result).instanceOf(Result<Subscription[]>);
        });

        it("returns Result with a list of subscriptions correctly", async () => {
            const req = {query: {}} as Request;
            const result: Result<Subscription[]> = await controller.getAll(req);

            expect(result).to.be.deep.eq({
                success: true,
                content: [{}],
                code: undefined
            });
        });

        it("should filter by subscription status cancel false correctly", async () => {
            const req = {query: {canceled: "false"}} as unknown as Request;
            const result: Result<Subscription[]> = await controller.getAll(req);

            expect(subscriptionService.getAll.calledOnceWith(false)).to.be.true;
            expect(result).to.be.deep.eq({
                success: true,
                content: [{}],
                code: undefined
            });
        });

        it("should filter by subscription status cancel true correctly", async () => {
            const req = {query: {canceled: "true"}} as unknown as Request;
            const result: Result<Subscription[]> = await controller.getAll(req);

            expect(subscriptionService.getAll.calledOnceWith(true)).to.be.true;
            expect(result).to.be.deep.eq({
                success: true,
                content: [{}],
                code: undefined
            });
        });

        it("throws when subscription creation fails", (done) => {
            const error = new Error("Oops");
            subscriptionService.getAll.rejects(error);
            const req = {query: {}} as Request;
            
            controller.getAll(req)
            .then(done)
            .catch(thrown => {
                expect(thrown).to.be.equal(error);
                done();
            });
        });

        it("throws when subscription is invalid", (done) => {
            const error = new DOMException("Oops");
            subscriptionService.getAll.throws(error);
            const req = {query: {}} as Request;
            
            controller.getAll(req)
            .then(done)
            .catch(thrown => {
                expect(thrown).to.be.equal(error);
                done();
            });
        });
    });

    describe("getDetails", () => {
        it("calls getById on the subscription service", async () => {
            const req = {params: {id: 1}} as unknown as Request;
            await controller.getDetails(req);
            expect(subscriptionService.getById.called).to.be.true;
        });

        it("returns Result with a subscription", async () => {
            const req = {params: {id: 1}} as unknown as Request;
            const result: Result<Subscription> = await controller.getDetails(req);
            expect(result).instanceOf(Result<Subscription>);
        });

        it("returns success Result a subscription correctly", async () => {
            const req = {params: {id: 1}} as unknown as Request;
            const result: Result<Subscription> = await controller.getDetails(req);

            expect(result).to.be.deep.eq({
                success: true,
                content: {},
                code: undefined
            });
        });

        ["", true, false, 0, null, undefined].forEach((invalidId) => {
            it(`throws when the subscription id is '${invalidId}'`, (done) => {
                const req = {params: {id: invalidId}} as unknown as Request;
                controller.getDetails(req)
                .then(done)
                .catch(thrown => {
                    expect(thrown).to.be.deep.equal(new CustomError("Should provide a valid subscription id"));
                    done();
                });
            });
        });

        it("returns success Result a subscription correctly", async () => {
            const req = {params: {id: 1}} as unknown as Request;
            const result: Result<Subscription> = await controller.getDetails(req);

            expect(result).to.be.deep.eq({
                success: true,
                content: {},
                code: undefined
            });
        });

        it("throws when subscription service is down", (done) => {
            const req = {params: {id: 1}} as unknown as Request;
            const error = new Error("Oops");
            subscriptionService.getById.rejects(error);
            
            controller.getDetails(req)
            .then(done)
            .catch(thrown => {
                expect(thrown).to.be.equal(error);
                done();
            });
        });
    });
});