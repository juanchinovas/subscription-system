"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailManager = void 0;
class EmailManager {
    constructor(emailSender) {
        this.emailSender = emailSender;
    }
    async notify(notification) {
        // Load the email template
        const template = `Hi ${notification.firstName ?? notification.email}
            We get new info campaign ${notification.campaignId} that we want to share with you.

            Thanks for sign in
        `;
        return this.emailSender.send({
            target: notification.email,
            payload: template
        });
    }
}
exports.EmailManager = EmailManager;
//# sourceMappingURL=EmailManager.js.map