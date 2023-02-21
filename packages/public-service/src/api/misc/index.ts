import { Express } from "express";

export function createMiscMiddleware(app: Express) {
    // Back to doc
    app.use((_,res) => {
        res.redirect("/docs");
    });
}