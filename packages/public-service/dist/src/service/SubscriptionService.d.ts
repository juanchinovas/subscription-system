import { ServiceRequestManager } from "../ServiceRequestManager";
export declare class SubscriptionService {
    private serviceRequestManager;
    constructor(serviceRequestManager: ServiceRequestManager);
    getAll(canceled: boolean): Promise<any>;
}
