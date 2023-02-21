"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Result = void 0;
class Result {
    constructor(result) {
        this.success = true;
        Object.assign(this, result);
    }
    static success(code = 200, content) {
        if (typeof code === "number" && !content) {
            return new Result({
                success: true,
                code: code
            });
        }
        if (typeof code !== "number" && !content) {
            return new Result({
                success: true,
                content: code
            });
        }
        return new Result({
            success: true,
            content,
            code: code ?? 200
        });
    }
    static fail(code = 400, content) {
        if (typeof code === "number" && !content) {
            return new Result({
                success: false,
                code: code
            });
        }
        if (typeof code !== "number" && !content) {
            return new Result({
                success: false,
                content: code
            });
        }
        return new Result({
            success: false,
            content,
            code
        });
    }
}
exports.Result = Result;
//# sourceMappingURL=Result.js.map