"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _QueueManager_queueConfig;
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueueManager = void 0;
const amqplib_1 = require("amqplib");
class QueueManager {
    constructor(configProvider) {
        this.configProvider = configProvider;
        _QueueManager_queueConfig.set(this, void 0);
    }
    async enqueue(suscription) {
        const [connection, channel] = (await this.connectQueue()) ?? [];
        if (!connection || !channel) {
            return false;
        }
        const result = channel.sendToQueue(__classPrivateFieldGet(this, _QueueManager_queueConfig, "f").queue, Buffer.from(JSON.stringify(suscription)));
        await channel.close();
        await connection.close();
        return result;
    }
    async connectQueue() {
        try {
            if (!__classPrivateFieldGet(this, _QueueManager_queueConfig, "f")) {
                this.readMQServerConfig();
            }
            const connection = await (0, amqplib_1.connect)(`amqp://${__classPrivateFieldGet(this, _QueueManager_queueConfig, "f").user}:${__classPrivateFieldGet(this, _QueueManager_queueConfig, "f").pass}@${__classPrivateFieldGet(this, _QueueManager_queueConfig, "f").host}:${__classPrivateFieldGet(this, _QueueManager_queueConfig, "f").port}`);
            const channel = await connection.createChannel();
            await channel.assertQueue(__classPrivateFieldGet(this, _QueueManager_queueConfig, "f").queue);
            console.log("Rabbit connected true");
            return [connection, channel];
        }
        catch (error) {
            console.log(error);
        }
    }
    readMQServerConfig() {
        const config = this.configProvider.read("mqmanager");
        __classPrivateFieldSet(this, _QueueManager_queueConfig, config, "f");
    }
}
exports.QueueManager = QueueManager;
_QueueManager_queueConfig = new WeakMap();
//# sourceMappingURL=QueueManager.js.map