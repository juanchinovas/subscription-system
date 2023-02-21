import { IEmailPayload, IEmailSender } from "./interfaces/IEmailSender";

export class LocalEmailSender implements IEmailSender {
    
    async send(payload: IEmailPayload): Promise<void> {
        console.log(`Sending email to ${payload.target}`);
        console.log(payload.payload);
    }
}