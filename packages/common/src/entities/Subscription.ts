import { validateSubscription } from "../subscrition.validation.zod";

export class Subscription {
    private constructor(suscription?: Partial<Subscription>) {
        Object.assign(this, suscription);
    }

    static fromObject(param: Partial<Subscription>) {
        param.dateOfBirth = typeof param.dateOfBirth === "string" ? new Date(param.dateOfBirth as string) : param.dateOfBirth;
        validateSubscription(param as Subscription);

        return new Subscription({
            isCanceled: param.isCanceled ?? false,
            id: (param as any)._id ?? param.id,
            firstName: param.firstName,
            gender: param.gender,
            email: param.email,
            dateOfBirth: param.dateOfBirth,
            consentFlag: param.consentFlag,
            campaignId: param.campaignId
        });
    }

    id?: string;
    firstName?: string;
    gender?: string;
    isCanceled?: boolean;
    email!: string;
    dateOfBirth!: Date | string;
    consentFlag!: number;
    campaignId!: number;
}