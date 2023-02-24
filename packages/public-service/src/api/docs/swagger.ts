import { Express } from 'express';
import swaggerUi from 'swagger-ui-express';
import ip from 'ip';
import swaggerDocument from '../../../swagger.json';

export function createSwaggerDocsMiddleware(app: Express, port: number, sha1?: string) {
    const service = swaggerDocument?.servers?.[0];
    service.url = service.url.replace("{host}", getCurrentIpAddress()).replace("{port}", port.toString());

    swaggerDocument.info.version = process.env.npm_package_version ?? "1.0.0";
    sha1 = sha1?.substring(0, 7) || undefined;
    swaggerDocument.info.description += `. \n\`\`\` (${sha1 ?? process.env.NODE_ENV}) v${process.env.npm_package_version}\`\`\``;
   
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

function getCurrentIpAddress() {
    const ipAddress = ip.address();
    return ip.isPrivate(ipAddress) ? "localhost" : ipAddress
}