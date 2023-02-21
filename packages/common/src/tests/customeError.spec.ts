import { expect } from "chai";
import { CustomError } from "../entities/CustomError";

describe("CustomError", () => {
    it("creates a CustomError correctly", () => {
        const error = new CustomError({message: "Oops"});
        expect(error).to.have.a.property('message', 'Oops');
    });

    it("creates a CustomError correctly with string parameter", () => {
        const error = new CustomError("Oops");
        expect(error).to.have.a.property('message', 'Oops');
    });

    it("creates a CustomError correctly without message", () => {
        const error = new CustomError({});
        expect(error).to.have.a.property('message').to.be.undefined;
    });

    it("creates a CustomError correctly with different object param", () => {
        const error = new CustomError({message: 'Test', details: "more info"});
        expect(error).to.have.a.property('message').to.not.be.undefined;
        expect(error).to.have.a.property('details', "more info");
    });
});