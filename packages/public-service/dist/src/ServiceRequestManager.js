"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceRequestManager = void 0;
const common_1 = require("@internal/common");
class ServiceRequestManager {
    constructor(configProvidr) {
        this.configProvidr = configProvidr;
    }
    async get(options) {
        const requestInfo = {
            url: `${this.getServiceUrl(options.service)}${options.path}`,
            data: options.data,
            timeout: options.timeout ?? 10000,
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        };
        return this.handlerResponse(this.startRequest(requestInfo));
    }
    async post(options) {
    }
    async delete(options) {
    }
    async handlerResponse(responsePromise) {
        return await responsePromise.then(this.buildResponseOrThrow);
    }
    async buildResponseOrThrow(response) {
        let body = null;
        if (response.headers.get("Content-Type")?.includes("application/json")) {
            body = await response.json();
        }
        body = await response.text();
        if (response.status > 399) {
            throw new common_1.CustomError({
                errorCode: response.status,
                message: response.statusText,
                response: body
            });
        }
        return body;
    }
    startRequest(internal) {
        const signalController = new AbortController();
        const requestPromise = fetch(internal.url, {
            method: internal.method,
            body: (internal.data && JSON.stringify(internal.data)) || null,
            referrer: "https://public-service",
            signal: signalController.signal,
            headers: internal.headers
        });
        setTimeout(() => {
            signalController.abort();
        }, internal.timeout);
        return requestPromise;
    }
    getServiceUrl(serviceName) {
        const serviceConfig = this.configProvidr.read(serviceName);
        return `${serviceConfig.host}:${serviceConfig.port}`;
    }
}
exports.ServiceRequestManager = ServiceRequestManager;
//# sourceMappingURL=ServiceRequestManager.js.map