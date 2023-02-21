import { Subscription } from "@internal/common";
import { model, Schema, set } from "mongoose";

/* mongoose. */ set('strictQuery', false);

const subscritionSchema = new Schema<Subscription & { _id: any }>({
    id: { type: Schema.Types.ObjectId },
    firstName: String,
    gender: String,
    isCanceled: Boolean,
    email: {type: String, required: true},
    dateOfBirth: {type: Date, required: true},
    consentFlag: {type: Number, required: true},
    campaignId: {type: Number, required: true},
});

export const SubscriptionModel = model<Schema<Subscription>>("subscriptions", subscritionSchema);
