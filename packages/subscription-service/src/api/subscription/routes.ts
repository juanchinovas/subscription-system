import { CustomError, Result } from "@internal/common";
import express, { Router } from "express";
import { SubscriptionController } from "./controller";

export function createSubscriptionRouter(controller: SubscriptionController) {
    const router: Router = express.Router();

    router.get("/", async (req, res) => {
        try {
            const result = await controller.getAll(req);
            res.json(result);
        } catch (error) {
            res.status(400).json(Result.fail(getErrorMessageOrError(error)));
        }
    });

    router.post("/", async (req, res) => {
        try {
            const result = await controller.create(req);
            if (result.code >= 200 && result.code < 600) {
                res.status(result.code);
            }
            res.json(result);
        } catch (error) {
            res.status(400).json(Result.fail(getErrorMessageOrError(error)));
        }
    });

    router.get("/:id", async (req, res) => {
        try {
            const result = await controller.getDetails(req);
            res.json(result);
        } catch (error) {
            res.status(400).json(Result.fail(getErrorMessageOrError(error)));
        }
    });

    router.delete("/:id", async (req, res) => {
        try {
            const result = await controller.cancel(req);
            res.json(result);
        } catch (error) {
            res.status(400).json(Result.fail(getErrorMessageOrError(error)));
        }
    });

    router.use((_, res) => {
        res.status(404).json(Result.fail(404, "Not found"));
    })

    function getErrorMessageOrError(error: unknown) {
        if (error instanceof Error && !(error instanceof CustomError)) {
            return error.message;
        }

        return error;
    }

    return ["/api/subscriptions", router] as [string, express.Router];
}