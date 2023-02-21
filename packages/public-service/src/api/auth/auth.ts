import { Express } from 'express';

export function createAuthMiddleware(app: Express) {
    app.use('/auth', () => {
        console.log("auth")
    });
}