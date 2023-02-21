import { CustomError, IConfigProvider } from "@internal/common";
import { response } from "express";

export declare type RequestOptions = {
    service: string,
    path: string;
    data?: Record<string, unknown>;
    timeout?: number;
};

declare type RequestInfo = {
    url: string;
    data?: Record<string, unknown>;
    headers?: Record<string, string>;
    timeout: number;
    method: "GET" | "POST" | "DELETE"
};

declare type ServiceConfig = {
    host: string;
    port: number
}

export class ServiceRequestManager {
    constructor(private configProvidr: IConfigProvider) {}

    async get(options: RequestOptions): Promise<any> {
        const requestInfo = {
            url: `${this.getServiceUrl(options.service)}${options.path}`,
            data: options.data,
            timeout: options.timeout ?? 10000,
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        } as RequestInfo;

        return this.handlerResponse(this.startRequest(requestInfo));
    }

    async post(options: RequestOptions): Promise<any> {
        const requestInfo = {
            url: `${this.getServiceUrl(options.service)}${options.path}`,
            data: options.data,
            timeout: options.timeout ?? 10000,
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        } as RequestInfo;

        return this.handlerResponse(this.startRequest(requestInfo))
    }

    async delete(options: RequestOptions): Promise<any> {
        const requestInfo = {
            url: `${this.getServiceUrl(options.service)}${options.path}`,
            data: options.data,
            timeout: options.timeout ?? 10000,
            method: "DELETE",
            headers: {
                "Accept": "application/json"
            }
        } as RequestInfo;

        return this.handlerResponse(this.startRequest(requestInfo))
    }

    private async handlerResponse([responsePromise, abortSignalerTimeout]: [Promise<Response>, NodeJS.Timeout] ) {
        try {
            const respose: Response = await responsePromise;
            clearTimeout(abortSignalerTimeout);
            return this.buildResponseOrThrow(respose);
        } catch (error) {
            clearTimeout(abortSignalerTimeout);
            if (response?.statusCode >= 500 || error instanceof DOMException) {
                throw new Error("Something went wrong, please try later", {cause: error})
            }
            throw error;
        }
    }

    private async  buildResponseOrThrow(response: Response) {
        let body = null;
        if (response.headers.get("Content-Type")?.includes("application/json")) {
            body = await response.json();
        } else {
            body = await response.text();
        }

        // http status code for errors
        if (!response.ok) {
            throw new CustomError({
                errorCode: response.status,
                message: response.statusText,
                responseBody: body
            });
        }

        return body;
    }

    private startRequest(internal: RequestInfo) {
        const signalController = new AbortController();
        const requestPromise =  fetch(internal.url, {
            method: internal.method,
            body: (internal.data && JSON.stringify(internal.data)) || null,
            referrer: "https://front-service",
            signal: signalController.signal,
            headers: internal.headers
        });

        const abortSignalId = setTimeout(() => {
            signalController.abort();
        }, internal.timeout);
        return [requestPromise, abortSignalId] satisfies [Promise<Response>, NodeJS.Timeout];
    }

    private getServiceUrl(serviceName: string) {
        const serviceConfig = this.configProvidr.read<ServiceConfig>(serviceName);
        return `${serviceConfig.host}:${serviceConfig.port}`;
    }
}