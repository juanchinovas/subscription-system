import { expect } from "chai";
import express from "express";
import supertest from "supertest";
import Sinon from "sinon";
import { SubscriptionController } from "../api/subscription/controller";
import { createSubscriptionRouter } from "../api/subscription/routes";
import { Result, Subscription } from "@internal/common";

describe("routes - createSubscriptionRouter", () => {
    const controllerMock = Sinon.createStubInstance(SubscriptionController);
    Sinon.replace(express, 'Router', Sinon.fake.returns(express.Router()));

    it("returns subscription api router", () => {
        const routesCreator = createSubscriptionRouter(controllerMock);
        expect(routesCreator).to.not.be.undefined;
    });

    it("returns root path", () => {
        const [rootPath] = createSubscriptionRouter(controllerMock);
        expect(rootPath).to.be.include("/subscriptions");
    });

    it("returns http 404 when url does not match a path in /subscriptions route", (done) => {
        const [rootPath, router] = createSubscriptionRouter(controllerMock);
        const app = express()
        app.use(rootPath, router);

        supertest(app)
        .post(`${rootPath}/random/path`)
        .expect(404, { success: false, content: 'Not found', code: 404 }, done);
    });

    describe("[GET /subscriptions]", () => {
        it("gets subscription list", (done) => {
            const controller = Object.create({
                getAll: Sinon.fake.resolves(Result.success([{}]))
            }) as SubscriptionController;
            const [rootPath, router] = createSubscriptionRouter(controller);
            const app = express()
            app.use(rootPath, router);

            supertest(app)
            .get(`${rootPath}`)
            .expect(200, {success: true, content: [{}]}, done);
        });

        it("returns a http error code plus body info when somthing is wrong", (done) => {
            const controller = Object.create({
                getAll: Sinon.fake.rejects(new Error("Oops"))
            }) as SubscriptionController;
            const [rootPath, router] = createSubscriptionRouter(controller);
            const app = express()
            app.use(rootPath, router);

            supertest(app)
            .get(`${rootPath}`)
            .expect(400, {success: false, content: "Oops"}, done);
        });
    });

    describe("[POST /subscriptions]", () => {
        it("creates subscription correctly", (done) => {
            const controller = Object.create({
                create: Sinon.fake.resolves(Result.success(201, {id: 1}))
            }) as SubscriptionController;
            const [rootPath, router] = createSubscriptionRouter(controller);
            const app = express()
            app.use(rootPath, router);

            supertest(app)
            .post(`${rootPath}`)
            .send({})
            .expect(201, {success: true, content: {id: 1}, code: 201}, done);
        });

        it("creates subscription and return operation code", (done) => {
            const controller = Object.create({
                create: Sinon.fake.resolves(Result.success(5, {id: 1}))
            }) as SubscriptionController;
            const [rootPath, router] = createSubscriptionRouter(controller);
            const app = express()
            app.use(rootPath, router);

            supertest(app)
            .post(`${rootPath}`)
            .send({})
            .expect(200, {success: true, code: 5, content: {id: 1}}, done);
        });

        it("returns a http error code plus body info when somthing is wrong", (done) => {
            const controller = Object.create({
                create: Sinon.fake.rejects(new Error("Oops"))
            }) as SubscriptionController;
            const [rootPath, router] = createSubscriptionRouter(controller);
            const app = express()
            app.use(rootPath, router);

            supertest(app)
            .post(`${rootPath}`)
            .expect(400, {success: false, content: "Oops"}, done);
        });
    });

    describe("[GET /subscriptions/:id]", () => {
        it("gets subscription details", (done) => {
            const subsDetails = {
                ...Subscription.fromObject({
                    campaignId: 45,
                    consentFlag: 1,
                    dateOfBirth: "2000-05-26",
                    email: "test@test.com",
                    firstName: "Testing Test",
                    gender: "M"
                }),
                id: 1,
            };
            const controller = Object.create({
                getDetails: Sinon.fake.resolves(Result.success(subsDetails))
            }) as SubscriptionController;
            const [rootPath, router] = createSubscriptionRouter(controller);
            const app = express()
            app.use(rootPath, router);

            supertest(app)
            .get(`${rootPath}/1`)
            .expect(200, {
                success: true,
                content: Object.assign(subsDetails, {dateOfBirth: (subsDetails.dateOfBirth as Date)?.toISOString()})
            }, done);
        });

        it("returns a http error code plus body info when somthing is wrong", (done) => {
            const controller = Object.create({
                getDetails: Sinon.fake.rejects(new Error("Oops"))
            }) as SubscriptionController;
            const [rootPath, router] = createSubscriptionRouter(controller);
            const app = express()
            app.use(rootPath, router);

            supertest(app)
            .get(`${rootPath}/1`)
            .expect(400, {success: false, content: "Oops"}, done);
        });
    });

    describe("[GET /subscriptions/:id]", () => {
        it("gets subscription details", (done) => {
            const subsDetails = {
                ...Subscription.fromObject({
                    campaignId: 45,
                    consentFlag: 1,
                    dateOfBirth: "2000-05-26",
                    email: "test@test.com",
                    firstName: "Testing Test",
                    gender: "M"
                }),
                id: 1,
            };
            const controller = Object.create({
                getDetails: Sinon.fake.resolves(Result.success(subsDetails))
            }) as SubscriptionController;
            const [rootPath, router] = createSubscriptionRouter(controller);
            const app = express()
            app.use(rootPath, router);

            supertest(app)
            .get(`${rootPath}/1`)
            .expect(200, {
                success: true,
                content: Object.assign(subsDetails, {dateOfBirth: (subsDetails.dateOfBirth as Date)?.toISOString()})
            }, done);
        });

        it("returns a http error code plus body info when somthing is wrong", (done) => {
            const controller = Object.create({
                getDetails: Sinon.fake.rejects(new Error("Oops"))
            }) as SubscriptionController;
            const [rootPath, router] = createSubscriptionRouter(controller);
            const app = express()
            app.use(rootPath, router);

            supertest(app)
            .get(`${rootPath}/1`)
            .expect(400, {success: false, content: "Oops"}, done);
        });
    });

    describe("[DELETE /subscriptions/:id]", () => {
        it("cancels subscription correctly", (done) => {
            const controller = Object.create({
                cancel: Sinon.fake.resolves(Result.success(true))
            }) as SubscriptionController;
            const [rootPath, router] = createSubscriptionRouter(controller);
            const app = express()
            app.use(rootPath, router);

            supertest(app)
            .delete(`${rootPath}/1`)
            .expect(200, {
                success: true,
                content: true
            }, done);
        });

        it("returns content false if the subscription could not be cancel", (done) => {
            const controller = Object.create({
                cancel: Sinon.fake.resolves(Result.success(false))
            }) as SubscriptionController;
            const [rootPath, router] = createSubscriptionRouter(controller);
            const app = express()
            app.use(rootPath, router);

            supertest(app)
            .delete(`${rootPath}/1`)
            .expect(200, {
                success: true,
                content: false
            }, done);
        });

        it("returns a http error code plus body info when somthing is wrong", (done) => {
            const controller = Object.create({
                cancel: Sinon.fake.rejects(new Error("Oops"))
            }) as SubscriptionController;
            const [rootPath, router] = createSubscriptionRouter(controller);
            const app = express()
            app.use(rootPath, router);

            supertest(app)
            .delete(`${rootPath}/1`)
            .expect(400, {success: false, content: "Oops"}, done);
        });
    });
})