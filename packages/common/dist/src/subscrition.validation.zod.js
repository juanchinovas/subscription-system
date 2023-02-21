"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSubscription = void 0;
const zod_1 = require("zod");
const CustomError_1 = require("./entities/CustomError");
const subscriptionZodSchema = zod_1.z.object({
    email: zod_1.z.string().email({ message: "Invalid email" }),
    dateOfBirth: zod_1.z.date()
        .min(new Date("1965-01-01"), { message: "Too old" })
        .max(new Date(`${(new Date().getFullYear()) - 18}-01-01`), { message: "Too young" }),
    consentFlag: zod_1.z.number().max(1).gt(0),
    campaignId: zod_1.z.number().min(1),
    firstName: zod_1.z.string().optional(),
    gender: zod_1.z.string().optional()
});
function validateSubscription(subscription) {
    const result = subscriptionZodSchema.safeParse(subscription);
    if (!result.success) {
        throw new CustomError_1.CustomError({
            message: "Invalid Subscription paramters",
            errors: result.error.errors.map(error => ({
                message: error.message,
                property: error.path
            }))
        });
    }
}
exports.validateSubscription = validateSubscription;
//# sourceMappingURL=subscrition.validation.zod.js.map