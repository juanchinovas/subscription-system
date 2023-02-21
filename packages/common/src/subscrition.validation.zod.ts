import { z } from "zod";
import { CustomError } from "./entities/CustomError";
import { Subscription } from "./entities/Subscription";

const subscriptionZodSchema = z.object({
    email: z.string().email({message: "Invalid email"}),
    dateOfBirth: z.date()
        .min(new Date("1965-01-01"), { message: "Too old" })
        .max(new Date(`${(new Date().getFullYear()) - 18}-01-01`), { message: "Too young" }),
    consentFlag: z.number().max(1).gt(0),
    campaignId: z.number().min(1),
    firstName: z.string().optional(),
    gender: z.string().optional()
});


export function validateSubscription(subscription: Subscription) {
    const result = subscriptionZodSchema.safeParse(subscription);
    if (!result.success) {
        throw new CustomError({
            message: "Invalid Subscription paramters",
            errors: result.error.errors.map(error => ({
                message: error.message,
                property: error.path
            }))
        });
    }
}