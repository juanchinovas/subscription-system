import { ConfigProvider } from "@internal/common";
import { EmailManager } from "./src/EmailManager";
import { LocalEmailSender } from "./src/LocalEmailSender";
import { QueueConsumer } from "./src/QueueConsumer";
import { YmlConfigFileReader } from "./src/YmlConfigFileReader";

const configProvider = new ConfigProvider(new YmlConfigFileReader());
const emailManager = new EmailManager(new LocalEmailSender());
const queueConsumer = new QueueConsumer(configProvider);

queueConsumer.registerObserver(emailManager);

setTimeout(async () => {
    const tries = configProvider.readPrimitive("server.tries", Number) ?? 5;
    let exception;
    for (let i = 0; i < tries; i++) {
        try {
            await queueConsumer.consume();
            exception = "Services connected to mq server";
            break;
        } catch (e) {
            console.log(`Trying ... ${i+1}/${tries}`);
            exception = e;
        }
        console.log(exception)
    }
}, 100);


process.on('SIGTERM', () => {
    console.info('SIGTERM signal received.');
    console.log('Stopping mq server listening.');
    queueConsumer.stop()
});