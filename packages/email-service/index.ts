import { ConfigProvider, ConsoleLogger, ILogger } from "@internal/common";
import { EmailManager } from "./src/EmailManager";
import { LocalEmailSender } from "./src/LocalEmailSender";
import { QueueConsumer } from "./src/QueueConsumer";
import { YmlConfigFileReader } from "./src/YmlConfigFileReader";

const logger: ILogger = new ConsoleLogger();
const configProvider = new ConfigProvider(new YmlConfigFileReader());
const emailManager = new EmailManager(new LocalEmailSender());
const queueConsumer = new QueueConsumer(configProvider, logger);

queueConsumer.registerObserver(emailManager);

setTimeout(async () => {
    const retries = configProvider.readPrimitive("server.retries", Number) ?? 5;
    let exception;
    for (let i = 0; i < retries; i++) {
        try {
            await queueConsumer.consume();
            exception = "Services connected to mq server";
            break;
        } catch (e) {
            console.log(`Trying ... ${i+1}/${retries}`);
            exception = e;
        }
        logger.log(exception)
    }
}, 100);


process.on('SIGTERM', () => {
    logger.log('SIGTERM signal received.');
    logger.log('Stopping mq server listening.');
    queueConsumer.stop()
});