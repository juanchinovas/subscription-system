import { Subscription } from "@internal/common";
import { IEmailSender } from "./interfaces/IEmailSender";
import { IObserver } from "./interfaces/IObserver";
export declare class EmailManager implements IObserver<Subscription> {
    private emailSender;
    constructor(emailSender: IEmailSender);
    notify(notification: Subscription): Promise<void>;
}
