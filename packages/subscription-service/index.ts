import { IDataHandler, ConfigProvider, Subscription } from "@internal/common";
import express from "express";
import { SubscriptionController } from "./src/api/subscription/controller";
import { createSubscriptionRouter } from "./src/api/subscription/routes";
import { InMemoryCacheManager } from "./src/data/InMemoryCacheManager";
import { SubscriptionManager } from "./src/managers/SubscriptionManager";
import { QueueManager } from "./src/managers/QueueManager";
import { SubscriptionDataHandler } from "./src/data/mongodb/SubscriptionDataHandler";
import mongoose from "mongoose";
import { YmlConfigFileReader } from "./src/managers/YmlConfigFileReader";

const configProvider = new ConfigProvider(new YmlConfigFileReader());
const app = express()
const port = process.env.PORT ?? configProvider.readPrimitive("server.port", Number);

const dataHandler: IDataHandler<Subscription> = new SubscriptionDataHandler(configProvider);
const chacheManager = new InMemoryCacheManager(configProvider);
const queueManager = new QueueManager(configProvider);
const subscriptionManager = new SubscriptionManager(dataHandler, chacheManager, queueManager);
const subscriptionController = new SubscriptionController(subscriptionManager);

const [rootPath, router] = createSubscriptionRouter(subscriptionController);

app.use(express.json());
app.use((req, _, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});
app.use(rootPath, router);

const server = app.listen(port, () => {
  console.log(`subscription service listening on port ${port}`)
});

process.on('SIGTERM', () => {
  console.info('SIGTERM signal received.');
  console.log('Closing http server.');
  server.close(() => {
    console.log('Http server closed.');
    // boolean means [force], see in mongoose doc
    mongoose.connection.close(false, () => {
      console.log('MongoDb connection closed.');
      process.exit(0);
    });
  });
});