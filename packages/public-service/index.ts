import { IDataHandler, ConfigProvider, Subscription } from "@internal/common";
import express from "express";
import { SubscriptionController } from "./src/api/subscription/controller";
import { createSubscriptionRouter } from "./src/api/subscription/routes";
import mongoose from "mongoose";
import { ServiceRequestManager } from "./src/ServiceRequestManager";
import { SubscriptionService } from "./src/service/SubscriptionService";
import { YmlConfigFileReader } from "./src/YmlConfigFileReader";

import swaggerUi from 'swagger-ui-express';
// @ts-ignore
import swaggerDocument from '../swagger.json';


const configProvider = new ConfigProvider(new YmlConfigFileReader());
const app = express()
const port = process.env.PORT ?? configProvider.readPrimitive("server.port", Number);

const serviceRequestManager = new ServiceRequestManager(configProvider);
const subscriptionService = new SubscriptionService(serviceRequestManager);
const subscriptionController = new SubscriptionController(subscriptionService);

const [rootPath, router] = createSubscriptionRouter(subscriptionController);

app.use(express.json())
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
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