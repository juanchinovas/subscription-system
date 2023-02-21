export declare class Subscription {
    private constructor();
    static fromObject(param: Partial<Subscription>): Subscription;
    id?: string;
    firstName?: string;
    gender?: string;
    isCanceled?: boolean;
    email: string;
    dateOfBirth: Date | string;
    consentFlag: number;
    campaignId: number;
}
