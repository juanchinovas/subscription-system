export interface IDataHandler<T> {
    add(t: T): Promise<T>;
    delete(t: T): Promise<boolean>;
    getById(id: unknown): Promise<T>;
    getAll(filter?: Partial<Record<keyof T, unknown>>): Promise<T[]>;
}