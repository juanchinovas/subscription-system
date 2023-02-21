import { ConfigProvider } from "@internal/common";
import express from "express";
import { SubscriptionController } from "./src/api/subscription/controller";
import mongoose from "mongoose";
import { ServiceRequestManager } from "./src/service/ServiceRequestManager";
import { SubscriptionService } from "./src/service/SubscriptionService";
import { YmlConfigFileReader } from "./src/YmlConfigFileReader";
import { createSwaggerDocsMiddleware, createMiscMiddleware, createSubscriptionRouter } from "./src/api";



const configProvider = new ConfigProvider(new YmlConfigFileReader());
const app = express();
app.use(express.json());

const serviceRequestManager = new ServiceRequestManager(configProvider);
const subscriptionService = new SubscriptionService(serviceRequestManager);
const subscriptionController = new SubscriptionController(subscriptionService);


// Log access Url
app.use((req, _, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});
const port = Number(process.env.PORT ?? configProvider.readPrimitive("server.port", Number));
createSwaggerDocsMiddleware(app, port ?? 80);
const [apiPath, router] = createSubscriptionRouter(subscriptionController);
app.use(apiPath, router);
createMiscMiddleware(app);


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