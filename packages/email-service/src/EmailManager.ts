import { Subscription } from "@internal/common";
import { IEmailSender } from "./interfaces/IEmailSender";
import { IObserver } from "./interfaces/IObserver";

export class EmailManager implements IObserver<Subscription> {

    constructor(private emailSender: IEmailSender) {}

    async notify(notification: Subscription): Promise<void> {
        // Load the email template
        const template = `Hi ${notification.firstName ?? notification.email}
            We get new info campaign ${notification.campaignId} that we want to share with you.

            Thanks for sign in
        `
        return this.emailSender.send({
            target: notification.email,
            payload: template
        });
    }
}