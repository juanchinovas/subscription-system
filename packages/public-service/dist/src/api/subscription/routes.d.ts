import express from "express";
import { SubscriptionController } from "./controller";
export declare function createSubscriptionRouter(controller: SubscriptionController): [string, express.Router];
