export class CustomError extends Error {

    constructor(detail: Record<string, unknown> | string) {
        super();

        Object.assign(this, typeof detail === "string" ? {message: detail} :  detail);
    }

    message: string = undefined as unknown as string;
}