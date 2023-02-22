import { expect } from "chai";
import { Result } from "../..";

describe("Result", () => {
    describe("fail", () => {
        it("should create a fail Result correctly", () => {
            const failResult = Result.fail(400, "Something went wrong");
            expect(failResult).instanceOf(Result);
            expect(failResult).to.be.deep.equal({
                success: false,
                content: "Something went wrong",
                code: 400
            });
        });
    
        it("should create a fail Result correctly with only content", () => {
            const failResult = Result.fail("Something went wrong");
            expect(failResult).to.be.deep.equal({
                success: false,
                content: "Something went wrong",
                code: undefined
            });
        });
        
        it("should create a fail Result correctly with only code", () => {
            const failResult = Result.fail(401);
            expect(failResult).to.be.deep.equal({
                success: false,
                code: 401,
                content: undefined
            });
        });
        
        it("should create a fail Result correctly with not param", () => {
            const failResult = Result.fail();
            expect(failResult).to.be.deep.equal({
                success: false,
                code: 400,
                content: undefined
            });
        });
    });

    describe("success", () => {
        it("should create a success Result correctly", () => {
            const successResult = Result.success(4, "Ok");
            expect(successResult).to.be.deep.equal({
                success: true,
                content: "Ok",
                code: 4
            });
        });

        it("should create a success Result correctly with only content", () => {
            const successResult = Result.success("Ok");
            expect(successResult).to.be.deep.equal({
                success: true,
                content: "Ok",
                code: undefined
            });
        });
        
        it("should create a success Result correctly with only code", () => {
            const successResult = Result.success(200);
            expect(successResult).instanceOf(Result);
            expect(successResult).to.be.deep.equal({
                success: true,
                code: 200,
                content: undefined
            });
        });

        
        it("should create a success Result correctly with not param", () => {
            const failResult = Result.success();
            expect(failResult).to.be.deep.equal({
                success: true,
                code: 200,
                content: undefined
            });
        });
    });
});