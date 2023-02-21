"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@internal/common");
const express_1 = __importDefault(require("express"));
const controller_1 = require("./src/api/subscription/controller");
const routes_1 = require("./src/api/subscription/routes");
const InMemoryCacheManager_1 = require("./src/data/InMemoryCacheManager");
const SubscriptionManager_1 = require("./src/managers/SubscriptionManager");
const QueueManager_1 = require("./src/managers/QueueManager");
const SubscriptionDataHandler_1 = require("./src/data/mongodb/SubscriptionDataHandler");
const mongoose_1 = __importDefault(require("mongoose"));
const YmlConfigFileReader_1 = require("./src/managers/YmlConfigFileReader");
const configProvider = new common_1.ConfigProvider(new YmlConfigFileReader_1.YmlConfigFileReader());
const app = (0, express_1.default)();
const port = process.env.PORT ?? configProvider.readPrimitive("server.port", Number);
const dataHandler = new SubscriptionDataHandler_1.SubscriptionDataHandler(configProvider);
const chacheManager = new InMemoryCacheManager_1.InMemoryCacheManager(configProvider);
const queueManager = new QueueManager_1.QueueManager(configProvider);
const subscriptionManager = new SubscriptionManager_1.SubscriptionManager(dataHandler, chacheManager, queueManager);
const subscriptionController = new controller_1.SubscriptionController(subscriptionManager);
const [rootPath, router] = (0, routes_1.createSubscriptionRouter)(subscriptionController);
app.use(express_1.default.json());
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