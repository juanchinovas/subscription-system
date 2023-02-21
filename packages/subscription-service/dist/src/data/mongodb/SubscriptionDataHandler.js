"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionDataHandler = void 0;
const common_1 = require("@internal/common");
const MongooseDataHandler_1 = require("./MongooseDataHandler");
const schema_1 = require("./schema");
class SubscriptionDataHandler extends MongooseDataHandler_1.MongooseDataHandler {
    constructor(config) {
        super(config, schema_1.SubscriptionModel);
        this.connect().catch(console.log);
    }
    async add(subscription) {
        const result = await super.add(subscription);
        return common_1.Subscription.fromObject(result);
    }
    async delete(subscription) {
        this.assertIsConnected();
        const result = await schema_1.SubscriptionModel.findByIdAndUpdate(subscription.id, {
            isCanceled: true
        });
        return Boolean(result?._id);
    }
    async getById(id) {
        this.assertIsConnected();
        const result = await schema_1.SubscriptionModel.findOne({
            _id: { $eq: id }
        });
        return (result && common_1.Subscription.fromObject(result?.toJSON())) || null;
    }
    async getAll(filter) {
        const results = await super.getAll(filter);
        return results.map(result => common_1.Subscription.fromObject(result));
    }
}
exports.SubscriptionDataHandler = SubscriptionDataHandler;
//# sourceMappingURL=SubscriptionDataHandler.js.map