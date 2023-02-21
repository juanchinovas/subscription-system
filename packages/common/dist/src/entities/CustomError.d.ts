export declare class CustomError extends Error {
    constructor(detail: Record<string, unknown> | string);
    message: string;
}
