import { Express } from 'express';
import swaggerUi from 'swagger-ui-express';
// @ts-ignore
import swaggerDocument from '../../../swagger.json';

export function createSwaggerDocsMiddleware(app: Express, port: number) {
    const service = swaggerDocument?.servers?.[0];
    service.url = service.url.replace("{host}", getCurrentIpAddress()).replace("{port}", port.toString());
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

function getCurrentIpAddress() {
    const ip = require('ip');
    const ipAddress = ip.address();

    return ip.isPrivate(ipAddress) ? "localhost" : ipAddress
}