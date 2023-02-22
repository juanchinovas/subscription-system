import { expect } from "chai";
import sinon from "sinon";
import { ConfigLoader } from "../interfaces/ConfigLoader";
import {ConfigProvider} from "../providers/ConfigProvider";

describe("ConfigProvider", () => {
    let configProvider: ConfigProvider;
    let configLoader: ConfigLoader;

    before(() => {
        const config = {
            test: {
                host: "test.com",
                port: 452
            },
            ttl: "45"
        };
        configLoader = {
            load: sinon.fake.returns(config)
        };
        configProvider = new ConfigProvider(configLoader);
    });

    after(() => {
        sinon.restore();
    });

    describe("readPrimitive", () => {
        it("returns config primitive value correctly", () => {
            const value = configProvider.readPrimitive("ttl", Number);
            expect(value).to.be.equal(45);
            expect(typeof value).to.be.equal("number");
        });

        it("returns config primitive value correctly using dot notation", () => {
            expect(configProvider.readPrimitive("test.host", String)).to.be.equal("test.com");
        });

        it("returns wrong value if the cast function is not the right one", () => {
            expect(configProvider.readPrimitive("test.host", Number)).to.not.be.equal("test.com");
        });
    });


    describe("read", () => {
        it("returns config object value correctly", () => {
            expect(configProvider.read("test")).to.have.a.property("port", 452)
        });

        it("returns config value correctly as string using dot notation", () => {
            const value = configProvider.read("ttl");
            expect(value).to.be.equal("45");
            expect(typeof value).to.be.equal("string");
        });
    });
});