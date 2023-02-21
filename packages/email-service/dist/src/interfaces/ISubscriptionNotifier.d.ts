export interface ISubscriptionNotifier {
    notify(subject: unknown): Promise<void>;
    registerObserver(observer: any): Promise<void>;
    removeObserver(observer: any): Promise<boolean>;
}
