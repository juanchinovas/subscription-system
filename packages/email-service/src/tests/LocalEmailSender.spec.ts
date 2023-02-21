import { expect } from "chai";
import Sinon from "sinon";
import { LocalEmailSender } from "../LocalEmailSender";

describe("LocalEmailSender", () => {
    let emailsender: LocalEmailSender;

    beforeEach(() => {
        emailsender = new LocalEmailSender();
    });

    afterEach(() => Sinon.restore());

    it("should send an email", async () => {
        const logSpy = Sinon.spy(console, 'log');
        await emailsender.send({
            target: "",
            payload: ""
        });

        expect(logSpy.calledTwice).to.be.true;
    });
})