"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@internal/common");
const express_1 = __importDefault(require("express"));
const controller_1 = require("./src/api/subscription/controller");
const routes_1 = require("./src/api/subscription/routes");
const mongoose_1 = __importDefault(require("mongoose"));
const ServiceRequestManager_1 = require("./src/ServiceRequestManager");
const SubscriptionService_1 = require("./src/service/SubscriptionService");
const YmlConfigFileReader_1 = require("./src/YmlConfigFileReader");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
// @ts-ignore
const swaggerDocument = require('../swagger.json');
const configProvider = new common_1.ConfigProvider(new YmlConfigFileReader_1.YmlConfigFileReader());
const app = (0, express_1.default)();
const port = process.env.PORT ?? configProvider.readPrimitive("server.port", Number);
const serviceRequestManager = new ServiceRequestManager_1.ServiceRequestManager(configProvider);
const subscriptionService = new SubscriptionService_1.SubscriptionService(serviceRequestManager);
const subscriptionController = new controller_1.SubscriptionController(subscriptionService);
const [rootPath, router] = (0, routes_1.createSubscriptionRouter)(subscriptionController);
app.use(express_1.default.json());
app.use('/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument));
app.use((req, _, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});
app.use(rootPath, router);
const server = app.listen(port, () => {
    console.log(`subscription service listening on port ${port}`);
});
process.on('SIGTERM', () => {
    console.info('SIGTERM signal received.');
    console.log('Closing http server.');
    server.close(() => {
        console.log('Http server closed.');
        // boolean means [force], see in mongoose doc
        mongoose_1.default.connection.close(false, () => {
            console.log('MongoDb connection closed.');
            process.exit(0);
        });
    });
});
//# sourceMappingURL=index.js.map