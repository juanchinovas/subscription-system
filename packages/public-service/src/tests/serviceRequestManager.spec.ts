import { CustomError, IConfigProvider } from "@internal/common";
import { expect } from "chai";
import Sinon from "sinon";
import { ServiceRequestManager } from "../service/ServiceRequestManager";

describe("ServiceRequestManager", () => {
    let configProvider: Partial<IConfigProvider>;
    let requestManager: ServiceRequestManager;
    let testFetchFn: Sinon.SinonStub;

    beforeEach(() => {
        testFetchFn = Sinon.stub(global, "fetch")
        configProvider = {
            read: Sinon.stub().returns({port: 5, host: "test.com"})
        };
        requestManager = new ServiceRequestManager(configProvider as IConfigProvider)
    });

    afterEach(() => {
        Sinon.restore();
    });

    describe("get", () => {
        it("calls service GET endpoint and get json from body correctly", async () => {
            const mockResponse = Object.assign(new Response(), {
                statusCode: 200,
                text: Sinon.fake.resolves('{}'),
                json: Sinon.fake.resolves({})
            });
            mockResponse.headers.append("Content-Type", "application/json");

            testFetchFn.resolves(mockResponse);
            const result = await requestManager.get({
                service: "test",
                path: "/"
            });
            expect(result).to.be.deep.equals({});
        });

        it("starts service GET endpoint request to the right url", async () => {
            const mockResponse = Object.assign(new Response(undefined, {
                headers: {
                    "Content-Type": "application/json"
                }
            }), {
                statusCode: 200,
                text: Sinon.fake.resolves('{}'),
                json: Sinon.fake.resolves({})
            });
            
            const spyOnstartRequest = Sinon.spy(requestManager, 'startRequest' as unknown as keyof ServiceRequestManager);
            const requestParam = {
                url: "test.com:5/endpoint",
                data: undefined,
                timeout: 10000,
                method: "GET",
                headers: {
                    "Accept": "application/json"
                }
            };
            testFetchFn.resolves(mockResponse);
            await requestManager.get({
                service: "test",
                path: "/endpoint"
            });

            expect(spyOnstartRequest.getCall(0)?.firstArg).to.be.deep.equal(requestParam);
        });

        it("calls service GET endpoint and get text from body correctly", async () => {
            const mockResponse = Object.assign(new Response(), {
                statusCode: 200,
                text: Sinon.fake.resolves('{}'),
                json: Sinon.fake.resolves({})
            });

            testFetchFn.resolves(mockResponse);
            const result = await requestManager.get({
                service: "test",
                path: "/"
            });
            expect(result).to.be.equals("{}");
        });

        it("throws when call service GET endpoint and response is not ok", (done) => {
            const mockResponse = Object.assign(new Response(undefined, {
                headers: {
                    "Content-Type": "application/json"
                },
                status: 400,
                statusText: "Oops"
            }), {
                text: Sinon.fake.resolves('{}'),
                json: Sinon.fake.resolves({})
            });
            testFetchFn.resolves(mockResponse);

            requestManager.get({
                service: "test",
                path: "/"
            })
            .then(() => done(new Error("wrong")))
            .catch(error => {
                expect(error).to.be.deep.equals(new CustomError({
                    errorCode: mockResponse.status,
                    message: mockResponse.statusText,
                    responseBody: {}
                }));
                done();
            });
        });

        it("throws when call to the service is not possible", (done) => {
            testFetchFn.throws(new Error("thrown"));

            requestManager.get({
                service: "test",
                path: "/"
            })
            .then(() => done(new Error("wrong")))
            .catch(error => {
                expect(error).to.be.deep.equals(new Error("thrown"));
                done();
            });
        });

        it("throws when call to the service takes long", function(done) {
            const timeout = 2;
            // Forcing mock fetch fail by calling abort
            // No, sure but looks like Sinon remove that functionality when you returns on the stubbed
            testFetchFn.returns(new Promise((_, rej) => {
                setTimeout(() => {
                    rej(new DOMException("Too long"));
                }, timeout);
            }));
            requestManager.get({
                service: "test",
                path: "/",
                timeout
            })
            .then(() => done(new Error("wrong")))
            .catch(error => {
                expect(error).to.be.deep.equals(new Error("Something went wrong, please try later"));
                done();
            });
        });
    });

    describe("post", () => {
        it("calls service POST endpoint and get json from body correctly", async () => {
            const mockResponse = Object.assign(new Response(), {
                statusCode: 200,
                text: Sinon.fake.resolves('{}'),
                json: Sinon.fake.resolves({})
            });
            mockResponse.headers.append("Content-Type", "application/json");

            testFetchFn.resolves(mockResponse);
            const result = await requestManager.post({
                service: "test",
                path: "/",
                data: {}
            });
            expect(result).to.be.deep.equals({});
        });

        it("calls service POST endpoint with empty body", async () => {
            const mockResponse = Object.assign(new Response(), {
                statusCode: 200,
                text: Sinon.fake.resolves('{}'),
                json: Sinon.fake.resolves({})
            });
            mockResponse.headers.append("Content-Type", "application/json");

            testFetchFn.resolves(mockResponse);
            const result = await requestManager.post({
                service: "test",
                path: "/"
            });
            expect(result).to.be.deep.equals({});
        });

        it("starts service POST endpoint request to the right url", async () => {
            const mockResponse = Object.assign(new Response(undefined, {
                headers: {
                    "Content-Type": "application/json"
                }
            }), {
                statusCode: 200,
                text: Sinon.fake.resolves('{}'),
                json: Sinon.fake.resolves({})
            });
            
            const spyOnstartRequest = Sinon.spy(requestManager, 'startRequest' as unknown as keyof ServiceRequestManager);
            const requestParam = {
                url: "test.com:5/endpoint",
                data: {},
                timeout: 5,
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                }
            };
            testFetchFn.resolves(mockResponse);
            await requestManager.post({
                service: "test",
                path: "/endpoint",
                data: {},
                timeout: 5,
            });
            expect(spyOnstartRequest.getCall(0)?.firstArg).to.be.deep.equal(requestParam);
        });

        it("calls service POST endpoint and get text from body correctly", async () => {
            const mockResponse = Object.assign(new Response(), {
                statusCode: 200,
                text: Sinon.fake.resolves('{}'),
                json: Sinon.fake.resolves({})
            });

            testFetchFn.resolves(mockResponse);
            const result = await requestManager.post({
                service: "test",
                path: "/",
                data: {}
            });
            expect(result).to.be.equals("{}");
        });

        it("throws when call service POST endpoint and response is not ok", (done) => {
            const mockResponse = Object.assign(new Response(undefined, {
                headers: {
                    "Content-Type": "application/json"
                },
                status: 400,
                statusText: "Oops"
            }), {
                text: Sinon.fake.resolves('{}'),
                json: Sinon.fake.resolves({})
            });
            testFetchFn.resolves(mockResponse);

            requestManager.post({
                service: "test",
                path: "/",
                data: {test: "tstring"}
            })
            .then(() => done(new Error("wrong")))
            .catch(error => {
                expect(error).to.be.deep.equals(new CustomError({
                    errorCode: mockResponse.status,
                    message: mockResponse.statusText,
                    responseBody: {}
                }));
                done();
            });
        });

        it("throws when call to the service is not possible", (done) => {
            testFetchFn.throws(new Error("thrown"));

            requestManager.post({
                service: "test",
                path: "/",
                data: {test: "tstring"}
            })
            .then(() => done(new Error("wrong")))
            .catch(error => {
                expect(error).to.be.deep.equals(new Error("thrown"));
                done();
            });
        });

        it("throws when call to the service takes long", function(done) {
            const timeout = 2;
            // Forcing mock fetch fail by calling abort
            // No, sure but looks like Sinon remove that functionality when you returns on the stubbed
            testFetchFn.returns(new Promise((_, rej) => {
                setTimeout(() => {
                    rej(new DOMException("Too long"));
                }, timeout);
            }));
            requestManager.post({
                service: "test",
                path: "/",
                timeout
            })
            .then(() => done(new Error("wrong")))
            .catch(error => {
                expect(error).to.be.deep.equals(new Error("Something went wrong, please try later"));
                done();
            });
        });
    });

    describe("delete", () => {
        it("calls service DELETE endpoint and get json from body correctly", async () => {
            const mockResponse = Object.assign(new Response(), {
                statusCode: 200,
                text: Sinon.fake.resolves('{}'),
                json: Sinon.fake.resolves({})
            });
            mockResponse.headers.append("Content-Type", "application/json");

            testFetchFn.resolves(mockResponse);
            const result = await requestManager.delete({
                service: "test",
                path: "/"
            });
            expect(result).to.be.deep.equals({});
        });

        it("starts service DELETE endpoint request to the right url", async () => {
            const mockResponse = Object.assign(new Response(undefined, {
                headers: {
                    "Content-Type": "application/json"
                }
            }), {
                statusCode: 200,
                text: Sinon.fake.resolves('{}'),
                json: Sinon.fake.resolves({})
            });
            
            const spyOnstartRequest = Sinon.spy(requestManager, 'startRequest' as unknown as keyof ServiceRequestManager);
            const requestParam = {
                url: "test.com:5/endpoint/45",
                data: undefined,
                timeout: 10000,
                method: "DELETE",
                headers: {
                    "Accept": "application/json"
                }
            };
            testFetchFn.resolves(mockResponse);
            await requestManager.delete({
                service: "test",
                path: "/endpoint/45"
            });

            expect(spyOnstartRequest.getCall(0)?.firstArg).to.be.deep.equal(requestParam);
        });

        it("calls service DELETE endpoint and get text from body correctly", async () => {
            const mockResponse = Object.assign(new Response(), {
                statusCode: 200,
                text: Sinon.fake.resolves('{}'),
                json: Sinon.fake.resolves({})
            });

            testFetchFn.resolves(mockResponse);
            const result = await requestManager.delete({
                service: "test",
                path: "/5"
            });
            expect(result).to.be.equals("{}");
        });

        it("throws when call service DELETE endpoint and response is not ok", (done) => {
            const mockResponse = Object.assign(new Response(undefined, {
                headers: {
                    "Content-Type": "application/json"
                },
                status: 400,
                statusText: "Oops"
            }), {
                text: Sinon.fake.resolves('{}'),
                json: Sinon.fake.resolves({})
            });
            testFetchFn.resolves(mockResponse);

            requestManager.delete({
                service: "test",
                path: "/6"
            })
            .then(() => done(new Error("wrong")))
            .catch(error => {
                expect(error).to.be.deep.equals(new CustomError({
                    errorCode: mockResponse.status,
                    message: mockResponse.statusText,
                    responseBody: {}
                }));
                done();
            });
        });

        it("throws when call to the service is not possible", (done) => {
            testFetchFn.throws(new Error("thrown"));

            requestManager.delete({
                service: "test",
                path: "/2"
            })
            .then(() => done(new Error("wrong")))
            .catch(error => {
                expect(error).to.be.deep.equals(new Error("thrown"));
                done();
            });
        });

        it("throws when call to the service takes long", function(done) {
            const timeout = 2;
            // Forcing mock fetch fail by calling abort
            // No, sure but looks like Sinon remove that functionality when you returns on the stubbed
            testFetchFn.returns(new Promise((_, rej) => {
                setTimeout(() => {
                    rej(new DOMException("Too long"));
                }, timeout);
            }));
            requestManager.delete({
                service: "test",
                path: "/45",
                timeout
            })
            .then(() => done(new Error("wrong")))
            .catch(error => {
                expect(error).to.be.deep.equals(new Error("Something went wrong, please try later"));
                done();
            });
        });
    });
});