import { Subscription } from "@internal/common";
import { expect } from "chai";
import Sinon, { SinonSpy } from "sinon";
import { EmailManager } from "../EmailManager";
import { IEmailSender } from "../interfaces/IEmailSender";

describe("EmailManager", () => {
    let emailManager: EmailManager;
    let emailSender: IEmailSender;

    beforeEach(() => {
        emailSender = {
            send: Sinon.fake.resolves(void 0)
        };
        emailManager = new EmailManager(emailSender);
    });

    afterEach(() => Sinon.restore());

    it("should notify by email", async () => {
        await emailManager.notify(Subscription.fromObject({
            campaignId: 45,
            consentFlag: 1,
            dateOfBirth: new Date(1990, 2, 2),
            email: "test@test.com",
        }));

        expect((emailSender.send as unknown as SinonSpy).calledOnce).to.be.true;
    });

    it("should print error when email sender fails", () => {
        const error = new Error("Oops")
        emailSender = {
            send: Sinon.fake.rejects(error)
        };
        emailManager = new EmailManager(emailSender);

        return emailManager.notify(Subscription.fromObject({
            campaignId: 45,
            consentFlag: 1,
            dateOfBirth: new Date(1990, 2, 2),
            email: "test@test.com",
        }))
        .catch((error) => {
            expect((emailSender.send as unknown as SinonSpy).calledOnce).to.be.true;
            expect(error).to.be.equal(error);
        })
    });
})