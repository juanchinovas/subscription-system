import { Subscription } from "@internal/common";
import { expect } from "chai";
import mongoose from "mongoose";
import Sinon from "sinon";
import * as allModels from "../data/mongodb/schema";
import { SubscriptionDataHandler } from "../data/mongodb/SubscriptionDataHandler";


describe("SubscriptionDataHandler", () => {
    let dataHandler : SubscriptionDataHandler;
    let configProvider;
    let MockedModel;

    function doMockModel() {
        const mockModelApi = {
            findByIdAndUpdate: Sinon.stub(),
            findOne: Sinon.stub(),
            save: Sinon.stub(),
            find: Sinon.stub(),
            toJSON: Sinon.fake.returns({
                id: 45,
                campaignId: 45,
                consentFlag: 1,
                dateOfBirth: new Date(1990, 2, 2),
                email: "test@test.com",
            }),
        };
        function MockModel() {
            this.version = 0;
        }
        MockModel.prototype = mockModelApi;
        // @ts-ignore
        Object.keys(mockModelApi).forEach(key => MockModel[key] = mockModelApi[key])

        return MockModel;
    }

    beforeEach(() => {
        configProvider = {
            read: Sinon.fake.returns({})
        };
        // @ts-ignore
        Sinon.replace(mongoose, "connect", Sinon.fake.resolves({ connection: {
            readyState: 1
        }}));
        MockedModel = doMockModel();
        // @ts-ignore
        Sinon.replace(allModels, "SubscriptionModel", MockedModel);
        

        dataHandler = new SubscriptionDataHandler(configProvider);
    });

    afterEach(() => {
        Sinon.restore();
    });

    it("throws when the db connection is not stablished", () => {
        const sandbox = Sinon.createSandbox();
        // @ts-ignore
        sandbox.replace(mongoose, "connect", Sinon.fake.resolves({connection: {
            readyState: 0
        }}));
        // @ts-ignore
        sandbox.replace(allModels, "SubscriptionModel", doMockModel());
        
        return new SubscriptionDataHandler(configProvider).getAll()
        .then(() => Promise.reject(new Error("Oops everything was Ok")))
        .catch(error => {
            sandbox.restore();
            expect(error).to.have.a.property("message", "Connection to db is not stablished");
        })
    })

    describe("getById", () => {
        it("should return subscription by Id", async () => {
            MockedModel.findOne.returns(MockedModel)
            const subscription = await dataHandler.getById(45);
            expect(subscription).to.not.be.undefined;
        })
    
        it("should return null when not subscription is find by Id", async () => {
            MockedModel.findOne.returns(null)
            const subscription = await dataHandler.getById(45);
            expect(subscription).to.be.null;
        })
    });

    describe("cancel", () => {
        it("returns true when subscription is canceled", async () => {
            MockedModel.findByIdAndUpdate.returns({_id: 45});
            const result = await dataHandler.delete({ id: "45"} as Subscription);
            expect(result).to.be.true;
        });
    
        it("returns false when subscription is not found", async () => {
            MockedModel.findByIdAndUpdate.returns({});
            const result = await dataHandler.delete({ id: "45"} as Subscription);
            expect(result).to.be.false;
        })
    });

    describe("getAll", () => {
        it("returns a list of subscription", async () => {
            MockedModel.find.returns([{
                campaignId: 45,
                consentFlag: 1,
                dateOfBirth: new Date(1990, 2, 2),
                email: "test@test.com",
            }]);
            const result = await dataHandler.getAll();
            expect(result.length).to.be.equal(1);
        });
    
        it("returns an empty list of subscription when there is not subscriptions registered", async () => {
            MockedModel.find.returns([]);
            const result = await dataHandler.getAll();
            expect(result.length).to.be.equals(0);
        });
    
        it("returns an list of subscription filtered by status", async () => {
            MockedModel.find.returns([]);
            const result = await dataHandler.getAll({isCanceled: true});
            expect(result).instanceOf(Array);
        });
    });

    describe("create", () => {
        it("should create a new subscription", async () => {
            MockedModel.save.returns(MockedModel)
            const subscription = await dataHandler.add({} as Subscription);
            expect(subscription).to.have.a.property("id")
        })
    });
});