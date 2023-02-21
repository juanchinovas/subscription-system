"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@internal/common");
const EmailManager_1 = require("./src/EmailManager");
const LocalEmailSender_1 = require("./src/LocalEmailSender");
const QueueConsumer_1 = require("./src/QueueConsumer");
const YmlConfigFileReader_1 = require("./src/YmlConfigFileReader");
const configProvider = new common_1.ConfigProvider(new YmlConfigFileReader_1.YmlConfigFileReader());
const emailManager = new EmailManager_1.EmailManager(new LocalEmailSender_1.LocalEmailSender());
const queueConsumer = new QueueConsumer_1.QueueConsumer(configProvider);
queueConsumer.registerObserver(emailManager);
setTimeout(() => {
    queueConsumer.consume().catch(console.log);
}, 100);
process.on('SIGTERM', () => {
    console.info('SIGTERM signal received.');
    console.log('Stopping mq server listening.');
    queueConsumer.stop();
});
//# sourceMappingURL=index.js.map