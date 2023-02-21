"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Subscription = void 0;
const subscrition_validation_zod_1 = require("../subscrition.validation.zod");
class Subscription {
    constructor(suscription) {
        Object.assign(this, suscription);
    }
    static fromObject(param) {
        param.dateOfBirth = typeof param.dateOfBirth === "string" ? new Date(param.dateOfBirth) : param.dateOfBirth;
        (0, subscrition_validation_zod_1.validateSubscription)(param);
        return new Subscription({
            isCanceled: param.isCanceled ?? false,
            id: param._id ?? param.id,
            firstName: param.firstName,
            gender: param.gender,
            email: param.email,
            dateOfBirth: param.dateOfBirth,
            consentFlag: param.consentFlag,
            campaignId: param.campaignId
        });
    }
}
exports.Subscription = Subscription;
//# sourceMappingURL=Subscription.js.map