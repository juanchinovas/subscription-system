"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSubscriptionRouter = void 0;
const common_1 = require("@internal/common");
const express_1 = __importDefault(require("express"));
function createSubscriptionRouter(controller) {
    const router = express_1.default.Router();
    router.get("/", async (req, res) => {
        try {
            const result = await controller.getAll(req);
            res.json(result);
        }
        catch (error) {
            res.status(400).json(common_1.Result.fail(getErrorMessageOrError(error)));
        }
    });
    // router.post("/", async (req, res) => {
    //     try {
    //         const result = await controller.create(req);
    //         if (result.code >= 200 && result.code < 600) {
    //             res.status(result.code);
    //         }
    //         res.json(result);
    //     } catch (error) {
    //         res.status(400).json(Result.fail(getErrorMessageOrError(error)));
    //     }
    // });
    // router.get("/:id", async (req, res) => {
    //     try {
    //         const result = await controller.getDetails(req);
    //         res.json(result);
    //     } catch (error) {
    //         res.status(400).json(Result.fail(getErrorMessageOrError(error)));
    //     }
    // });
    // router.delete("/:id", async (req, res) => {
    //     try {
    //         const result = await controller.cancel(req);
    //         res.json(result);
    //     } catch (error) {
    //         res.status(400).json(Result.fail(getErrorMessageOrError(error)));
    //     }
    // });
    // router.use((_, res) => {
    //     res.status(404).json(Result.fail(404, "Not found"));
    // })
    function getErrorMessageOrError(error) {
        if (error instanceof Error && !(error instanceof common_1.CustomError)) {
            return error.message;
        }
        return error;
    }
    return ["/v1/subscriptions", router];
}
exports.createSubscriptionRouter = createSubscriptionRouter;
//# sourceMappingURL=routes.js.map