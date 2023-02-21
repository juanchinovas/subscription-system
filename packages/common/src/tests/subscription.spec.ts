import { expect, should } from "chai";
import { Subscription } from "../..";

describe("Subscription", () => {
    it("should throw when try to create a Subscription with invalid params", () => {
        should().Throw(() => Subscription.fromObject({}))
    });

    it("should create a Subscription correctly with required params", () => {
        expect(Subscription.fromObject({
            campaignId: 45,
            consentFlag: 1,
            dateOfBirth: new Date(1990, 2, 2),
            email: "test@test.com",
        })).instanceOf(Subscription);
    });

    it("should create a canceled Subscription correctly", () => {
        expect(Subscription.fromObject({
            campaignId: 45,
            consentFlag: 1,
            dateOfBirth: new Date(1990, 2, 2),
            email: "test@test.com",
            isCanceled: true
        })).to.have.a.property("isCanceled", true);
    });

    it("should create a Subscription correctly with all its params", () => {
        expect(Subscription.fromObject({
            campaignId: 45,
            consentFlag: 1,
            dateOfBirth: new Date(1990, 2, 2),
            email: "test@test.com",
            firstName: "Testing Test",
            gender: "M"
        })).instanceOf(Subscription);
    });

    it("should throw when consent flag is zero or not accepted", () => {
        should().Throw(
            () => Subscription.fromObject({
                campaignId: 45,
                consentFlag: 0,
                dateOfBirth: new Date(1990, 2, 2),
                email: "test@test.com",
                firstName: "Testing Test",
                gender: "M"
            }),
            "Invalid Subscription paramters")
    });

    it("should allow to create suscription with birthdate as string", () => {
        expect(Subscription.fromObject({
            campaignId: 45,
            consentFlag: 1,
            dateOfBirth: "1990-02-02",
            email: "test@test.com",
            firstName: "Testing Test",
            gender: "M"
        })).instanceOf(Subscription);
    });

    it("should not allow to create suscription with invalid string date birthdate", () => {
        try {
            Subscription.fromObject({
                campaignId: 45,
                consentFlag: 1,
                dateOfBirth: "0000-02-02",
                email: "test@test.com",
                firstName: "Testing Test",
                gender: "M"
            });
        } catch (error) {
            expect(error).to.have.property("errors").to.be.deep.equal([ { message: 'Too old', property: [ 'dateOfBirth' ] } ]);
        }
    });
});