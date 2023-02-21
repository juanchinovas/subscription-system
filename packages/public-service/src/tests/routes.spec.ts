import { expect } from "chai";
import express, {Express} from "express";
import supertest from "supertest";
import Sinon from "sinon";
import { SubscriptionController } from "../api/subscription/controller";
import { createSubscriptionRouter } from "../api/subscription/routes";
import { Result, Subscription } from "@internal/common";

describe("routes - createSubscriptionRouter", () => {
    let mockControler: Sinon.SinonStubbedInstance<SubscriptionController>;
    Sinon.replace(express, 'Router', Sinon.fake.returns(express.Router()));

    beforeEach(() => {
        mockControler = Sinon.createStubInstance(SubscriptionController);
    });

    afterEach(() => {
        Sinon.restore();
    })

    function createApiMiddleware(mockControler: SubscriptionController, app?: Express) {
        if (app) {
            const [apiPath, router] = createSubscriptionRouter(mockControler);
            app.use(apiPath, router);
        }

        return createSubscriptionRouter(mockControler);
    }

    it("returns root path", () => {
        const [path] = createApiMiddleware({} as unknown as SubscriptionController);
        expect(path).to.be.equal("/api/v1/subscriptions");
    });


    describe("[GET api/subscriptions]", () => {
        it("gets subscription list", (done) => {
            mockControler.getAll.resolves(Result.success([{}] as Array<Subscription>));
            const app = express()
            createApiMiddleware(mockControler, app);

            supertest(app)
            .get(`/api/v1/subscriptions`)
            .expect(200, {success: true, content: [{}]}, done);
        });

        it("returns a http error code plus body info when somthing is wrong", (done) => {
            mockControler.getAll.throws(new Error("Oops"));
            const app = express();
            createApiMiddleware(mockControler, app);

            supertest(app)
            .get(`/api/v1/subscriptions`)
            .expect(400, {success: false, content: {message: "Oops"}}, done);
        });
    });

    describe("[POST api/subscriptions]", () => {
        it("creates subscription correctly", (done) => {
            mockControler.create.resolves(Result.success(201, {id: 1} as unknown as Subscription));
            const app = express()
            createApiMiddleware(mockControler, app);

            supertest(app)
            .post(`/api/v1/subscriptions`)
            .send({})
            .expect(201, {success: true, content: {id: 1}, code: 201}, done);
        });

        it("creates subscription and return operation code 201", (done) => {
            mockControler.create.resolves(Result.success(201, {id: 1} as unknown as Subscription));;
            const app = express()
           createApiMiddleware(mockControler, app);

            supertest(app)
            .post(`/api/v1/subscriptions`)
            .send({})
            .expect(201, { success: true, code: 201, content: {id: 1}}, done);
        });

        it("creates subscription and return operation code 5", (done) => {
            mockControler.create.resolves(Result.success(5, {id: 1} as unknown as Subscription));;
            const app = express()
           createApiMiddleware(mockControler, app);

            supertest(app)
            .post(`/api/v1/subscriptions`)
            .send({})
            .expect(200, { success: true, code: 5, content: {id: 1}}, done);
        });

        it("returns a http error code plus body info when somthing is wrong", (done) => {
            mockControler.create.throws(new Error("Oops"));
            const app = express()
            createApiMiddleware(mockControler, app);

            supertest(app)
            .post(`/api/v1/subscriptions`)
            .expect(400, {success: false, content: {message: "Oops"}}, done);
        });
    });

    describe("[GET api/subscriptions/:id]", () => {
        it("gets subscription details", (done) => {
            const subsDetails = Subscription.fromObject({
                campaignId: 45,
                consentFlag: 1,
                dateOfBirth: "2000-05-26",
                email: "test@test.com",
                firstName: "Testing Test",
                gender: "M",
                id: "1"
            });

            mockControler.getDetails.resolves(Result.success(subsDetails));
            const app = express();
            createApiMiddleware(mockControler, app);

            supertest(app)
            .get(`/api/v1/subscriptions/1`)
            .expect(200, {
                success: true,
                content: Object.assign({}, subsDetails, {dateOfBirth: (subsDetails.dateOfBirth as Date)?.toISOString()})
            }, done);
        });

        it("returns a http error code plus body info when somthing is wrong", (done) => {
            mockControler.getDetails.rejects(new Error("Oops"));
            const app = express();
            createApiMiddleware(mockControler, app);

            supertest(app)
            .get(`/api/v1/subscriptions/1`)
            .expect(400, {success: false, content: {message: "Oops"}}, done);
        });
    });

    describe("[DELETE api/subscriptions/:id]", () => {
        it("cancels subscription correctly", (done) => {
            mockControler.cancel.resolves(Result.success(true));
            const app = express()
            createApiMiddleware(mockControler, app);

            supertest(app)
            .delete(`/api/v1/subscriptions/1`)
            .expect(200, {
                success: true,
                content: true
            }, done);
        });

        it("returns content false if the subscription could not be cancel", (done) => {
            mockControler.cancel.resolves(Result.success(false));
            const app = express()
            createApiMiddleware(mockControler, app);

            supertest(app)
            .delete(`/api/v1/subscriptions/1`)
            .expect(200, {
                success: true,
                content: false
            }, done);
        });

        it("returns a http error code plus body info when somthing is wrong", (done) => {
            mockControler.cancel.throws(new Error("Oops"));
            const app = express()
            createApiMiddleware(mockControler, app);

            supertest(app)
            .delete(`/api/v1/subscriptions/1`)
            .expect(400, {success: false, content: {message: "Oops"}}, done);
        });
    });
})