import { expect } from "chai";
import express, {Express} from "express";
import supertest from "supertest";
import Sinon from "sinon";
import { SubscriptionController } from "../api/subscription/controller";
import { createSubscriptionRouter } from "../api/subscription/routes";
import { Result, Subscription } from "@internal/common";

describe("routes - createApiMiddleware", () => {
    let controllerMock: Sinon.SinonStubbedInstance<SubscriptionController>;

    function createApiMiddleware(controllerMock: SubscriptionController, app?: Express, ) {
        if (app) {
            const [apiPath, router] = createSubscriptionRouter(controllerMock);
            app.use(apiPath, router);
        }

        return createSubscriptionRouter(controllerMock);
    }

    beforeEach(() => {
        Sinon.replace(express, 'Router', Sinon.fake.returns(express.Router()));
        controllerMock = Sinon.createStubInstance(SubscriptionController);
    });

    afterEach(() => {
        Sinon.restore();
    })

    it("returns subscription api router", () => {
        const routesCreator = createApiMiddleware(controllerMock);
        expect(routesCreator).to.not.be.undefined;
    });

    it("returns root path", () => {
        const [rootPath] = createApiMiddleware(controllerMock);
        expect(rootPath).to.be.equals("/api/subscriptions");
    });

    it("returns http 404 when url does not match a path in /subscriptions route", (done) => {
        const app = express();
        createApiMiddleware(controllerMock, app);

        supertest(app)
        .post(`/api/subscriptions/random/path`)
        .expect(404, { success: false, content: 'Not found', code: 404 }, done);
    });

    describe("[GET api/subscriptions]", () => {
        it("gets subscription list", (done) => {
            controllerMock.getAll.resolves(Result.success([{}] as Subscription[]));
            const app = express()
            createApiMiddleware(controllerMock, app);

            supertest(app)
            .get(`/api/subscriptions`)
            .expect(200, {success: true, content: [{}]}, done);
        });

        it("returns a http error code plus body info when somthing is wrong", (done) => {
            controllerMock.getAll.rejects(new Error("Oops"));
            const app = express();
            createApiMiddleware(controllerMock, app);

            supertest(app)
            .get(`/api/subscriptions`)
            .expect(400, {success: false, content: "Oops"}, done);
        });
    });

    describe("[POST api/subscriptions]", () => {
        it("creates subscription correctly", (done) => {
            controllerMock.create.resolves(Result.success(201, {id: 1} as unknown as Subscription));
            const app = express()
            createApiMiddleware(controllerMock, app);

            supertest(app)
            .post(`/api/subscriptions`)
            .send({})
            .expect(201, {success: true, content: {id: 1}, code: 201}, done);
        });

        it("creates subscription and return operation code", (done) => {
            controllerMock.create.resolves(Result.success(5, {id: 1} as unknown as Subscription));
            const app = express()
           createApiMiddleware(controllerMock, app);

            supertest(app)
            .post(`/api/subscriptions`)
            .send({})
            .expect(200, {success: true, code: 5, content: {id: 1}}, done);
        });

        it("returns a http error code plus body info when somthing is wrong", (done) => {
            controllerMock.create.rejects(new Error("Oops"));
            const app = express()
            createApiMiddleware(controllerMock, app);

            supertest(app)
            .post(`/api/subscriptions`)
            .expect(400, {success: false, content: "Oops"}, done);
        });
    });

    describe("[GET api/subscriptions/:id]", () => {
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
            controllerMock.getDetails.resolves(Result.success(subsDetails  as unknown as Subscription));
            const app = express();
            createApiMiddleware(controllerMock, app);

            supertest(app)
            .get(`/api/subscriptions/1`)
            .expect(200, {
                success: true,
                content: Object.assign(subsDetails, {dateOfBirth: (subsDetails.dateOfBirth as Date)?.toISOString()})
            }, done);
        });

        it("returns a http error code plus body info when somthing is wrong", (done) => {
            controllerMock.getDetails.rejects(new Error("Oops"));
            const app = express();
            createApiMiddleware(controllerMock, app);

            supertest(app)
            .get(`/api/subscriptions/1`)
            .expect(400, {success: false, content: "Oops"}, done);
        });
    });

    describe("[GET api/subscriptions/:id]", () => {
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
            controllerMock.getDetails.resolves(Result.success(subsDetails as unknown as Subscription));
            const app = express();
            createApiMiddleware(controllerMock, app);

            supertest(app)
            .get(`/api/subscriptions/1`)
            .expect(200, {
                success: true,
                content: Object.assign(subsDetails, {dateOfBirth: (subsDetails.dateOfBirth as Date)?.toISOString()})
            }, done);
        });

        it("returns a http error code plus body info when somthing is wrong", (done) => {
            controllerMock.getDetails.rejects(new Error("Oops"));
            const app = express();
            createApiMiddleware(controllerMock, app);

            supertest(app)
            .get(`/api/subscriptions/1`)
            .expect(400, {success: false, content: "Oops"}, done);
        });
    });

    describe("[DELETE api/subscriptions/:id]", () => {
        it("cancels subscription correctly", (done) => {
            controllerMock.cancel.resolves(Result.success(true));
            const app = express()
            createApiMiddleware(controllerMock, app);

            supertest(app)
            .delete(`/api/subscriptions/1`)
            .expect(200, {
                success: true,
                content: true
            }, done);
        });

        it("returns content false if the subscription could not be cancel", (done) => {
            controllerMock.cancel.resolves(Result.success(false));
            const app = express()
            createApiMiddleware(controllerMock, app);

            supertest(app)
            .delete(`/api/subscriptions/1`)
            .expect(200, {
                success: true,
                content: false
            }, done);
        });

        it("returns a http error code plus body info when somthing is wrong", (done) => {
            controllerMock.cancel.rejects(new Error("Oops"));
            const app = express()
            createApiMiddleware(controllerMock, app);

            supertest(app)
            .delete(`/api/subscriptions/1`)
            .expect(400, {success: false, content: "Oops"}, done);
        });
    });
})