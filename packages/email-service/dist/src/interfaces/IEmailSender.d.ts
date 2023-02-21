export interface IEmailPayload {
    target: string;
    payload: string;
}
export interface IEmailSender {
    send(payload: IEmailPayload): Promise<void>;
}
