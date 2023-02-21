export declare class Result<T> {
    private constructor();
    static success<T>(code?: number): Result<T>;
    static success<T>(content: T): Result<T>;
    static success<T>(code: number, content: T): Result<T>;
    static fail<T>(code?: number): Result<T>;
    static fail<T>(content: T): Result<T>;
    static fail<T>(code: number, content: T): Result<T>;
    success: boolean;
    code: number;
    content?: T;
}
