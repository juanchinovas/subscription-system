"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalEmailSender = void 0;
class LocalEmailSender {
    async send(payload) {
        console.log(`Sending email to ${payload.target}`);
        console.log(payload.payload);
    }
}
exports.LocalEmailSender = LocalEmailSender;
//# sourceMappingURL=LocalEmailSender.js.map