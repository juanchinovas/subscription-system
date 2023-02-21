export interface IObserver<T> {
    notify(subject: T): Promise<void>
}