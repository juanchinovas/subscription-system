"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongooseDataHandler = void 0;
const common_1 = require("@internal/common");
const mongoose_1 = require("mongoose");
class MongooseDataHandler {
    constructor(config, MongooseModel) {
        this.config = config;
        this.MongooseModel = MongooseModel;
        this.isConnected = false;
    }
    async add(t) {
        this.assertIsConnected();
        const newT = new this.MongooseModel(t);
        return (await newT.save()).toJSON();
    }
    async getAll(filter) {
        this.assertIsConnected();
        let filterBy = {};
        if (filter) {
            const keys = Object.keys(filter);
            filterBy = keys.reduce((query, key) => {
                query.$and.push({ [key]: { $eq: filter[key] } });
                return query;
            }, { $and: [] });
        }
        return this.MongooseModel.find(filterBy);
    }
    async connect() {
        const dbConfigInfo = this.config.read("database");
        const { connection } = await (0, mongoose_1.connect)(`mongodb://${dbConfigInfo.user}:${dbConfigInfo.pass}@${dbConfigInfo.host}:${dbConfigInfo.port}`, {
            dbName: dbConfigInfo.db,
        });
        this.isConnected = Boolean(connection.readyState === 1);
        console.log("mongodb connected ", this.isConnected);
    }
    assertIsConnected() {
        if (!this.isConnected) {
            throw new common_1.CustomError({
                message: "Connection to db is not stablished"
            });
        }
    }
}
exports.MongooseDataHandler = MongooseDataHandler;
//# sourceMappingURL=MongooseDataHandler.js.map