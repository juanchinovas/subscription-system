"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionModel = void 0;
const mongoose_1 = require("mongoose");
/* mongoose. */ (0, mongoose_1.set)('strictQuery', false);
const subscritionSchema = new mongoose_1.Schema({
    id: { type: mongoose_1.Schema.Types.ObjectId },
    firstName: String,
    gender: String,
    isCanceled: Boolean,
    email: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    consentFlag: { type: Number, required: true },
    campaignId: { type: Number, required: true },
});
exports.SubscriptionModel = (0, mongoose_1.model)("subscriptions", subscritionSchema);
//# sourceMappingURL=schema.js.map