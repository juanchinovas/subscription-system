import { IConfigProvider } from "@internal/common";
export declare type RequestOptions = {
    service: string;
    path: string;
    data?: Record<string, unknown>;
    timeout?: number;
};
export declare class ServiceRequestManager {
    private configProvidr;
    constructor(configProvidr: IConfigProvider);
    get(options: RequestOptions): Promise<any>;
    post(options: RequestOptions): Promise<any>;
    delete(options: RequestOptions): Promise<any>;
    private handlerResponse;
    private buildResponseOrThrow;
    private startRequest;
    private getServiceUrl;
}
