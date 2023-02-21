import { expect } from "chai";
import { YmlConfigFileReader } from "../YmlConfigFileReader";

describe("YmlConfigFileReader", () => {

    it("should create a yml config file reader", async () => {
        expect(new YmlConfigFileReader()).to.be.instanceOf(YmlConfigFileReader);
    });
})