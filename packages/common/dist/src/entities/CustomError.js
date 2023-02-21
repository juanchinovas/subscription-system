"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomError = void 0;
class CustomError extends Error {
    constructor(detail) {
        super();
        this.message = undefined;
        Object.assign(this, typeof detail === "string" ? { message: detail } : detail);
    }
}
exports.CustomError = CustomError;
//# sourceMappingURL=CustomError.js.map