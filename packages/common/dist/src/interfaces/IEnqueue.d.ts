export interface IEnqueue<T> {
    enqueue(suscription: T): Promise<boolean>;
}
