"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _QueueConsumer_queueConfig, _QueueConsumer_observers, _QueueConsumer_mqConnetion, _QueueConsumer_mqChannel;
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueueConsumer = void 0;
const amqplib_1 = require("amqplib");
const common_1 = require("@internal/common");
class QueueConsumer {
    constructor(configProvider) {
        this.configProvider = configProvider;
        _QueueConsumer_queueConfig.set(this, void 0);
        _QueueConsumer_observers.set(this, void 0);
        _QueueConsumer_mqConnetion.set(this, void 0);
        _QueueConsumer_mqChannel.set(this, void 0);
        __classPrivateFieldSet(this, _QueueConsumer_observers, [], "f");
        this.readMQServerConfig();
    }
    async notify(subject) {
        __classPrivateFieldGet(this, _QueueConsumer_observers, "f").forEach(observer => observer.notify(subject));
    }
    async registerObserver(observer) {
        __classPrivateFieldGet(this, _QueueConsumer_observers, "f").push(observer);
    }
    async removeObserver(observer) {
        const index = __classPrivateFieldGet(this, _QueueConsumer_observers, "f").findIndex(ob => ob === observer);
        if (index > -1) {
            __classPrivateFieldGet(this, _QueueConsumer_observers, "f").splice(index, 1);
            return true;
        }
        return false;
    }
    async consume() {
        var _a, _b;
        _a = this, _b = this, [({ set value(_c) { __classPrivateFieldSet(_a, _QueueConsumer_mqConnetion, _c, "f"); } }).value, ({ set value(_c) { __classPrivateFieldSet(_b, _QueueConsumer_mqChannel, _c, "f"); } }).value] = (await this.connectQueue()) ?? [];
        if (!__classPrivateFieldGet(this, _QueueConsumer_mqConnetion, "f") || !__classPrivateFieldGet(this, _QueueConsumer_mqChannel, "f")) {
            throw new common_1.CustomError("Unable to connect to the mq server");
        }
        __classPrivateFieldGet(this, _QueueConsumer_mqChannel, "f").consume(__classPrivateFieldGet(this, _QueueConsumer_queueConfig, "f").queue, (message) => {
            const notificaion = JSON.parse(message?.content?.toString());
            const subscription = common_1.Subscription.fromObject(notificaion);
            this.notify(subscription);
            __classPrivateFieldGet(this, _QueueConsumer_mqChannel, "f")?.ack(message);
        });
    }
    stop() {
        __classPrivateFieldGet(this, _QueueConsumer_mqChannel, "f")?.close();
        __classPrivateFieldGet(this, _QueueConsumer_mqConnetion, "f")?.close();
    }
    async connectQueue() {
        try {
            if (!__classPrivateFieldGet(this, _QueueConsumer_queueConfig, "f")) {
                this.readMQServerConfig();
            }
            const connection = await (0, amqplib_1.connect)(`amqp://${__classPrivateFieldGet(this, _QueueConsumer_queueConfig, "f").user}:${__classPrivateFieldGet(this, _QueueConsumer_queueConfig, "f").pass}@${__classPrivateFieldGet(this, _QueueConsumer_queueConfig, "f").host}:${__classPrivateFieldGet(this, _QueueConsumer_queueConfig, "f").port}`);
            const channel = await connection.createChannel();
            await channel.assertQueue(__classPrivateFieldGet(this, _QueueConsumer_queueConfig, "f").queue);
            console.log("Rabbit connected true");
            return [connection, channel];
        }
        catch (error) {
            console.log(error);
        }
    }
    readMQServerConfig() {
        const config = __classPrivateFieldGet(this, _QueueConsumer_queueConfig, "f") ?? this.configProvider.read("mqmanager");
        __classPrivateFieldSet(this, _QueueConsumer_queueConfig, config, "f");
    }
}
exports.QueueConsumer = QueueConsumer;
_QueueConsumer_queueConfig = new WeakMap(), _QueueConsumer_observers = new WeakMap(), _QueueConsumer_mqConnetion = new WeakMap(), _QueueConsumer_mqChannel = new WeakMap();
//# sourceMappingURL=QueueConsumer.js.map