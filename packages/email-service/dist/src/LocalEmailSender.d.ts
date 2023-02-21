import { IEmailPayload, IEmailSender } from "./interfaces/IEmailSender";
export declare class LocalEmailSender implements IEmailSender {
    send(payload: IEmailPayload): Promise<void>;
}
