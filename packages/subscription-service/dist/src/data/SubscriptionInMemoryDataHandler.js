"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionInMemoryDataHandler = void 0;
class SubscriptionInMemoryDataHandler {
    constructor() {
        this.db = [];
    }
    async add(subscription) {
        subscription.id = (this.db.length + 1).toString();
        this.db.push(subscription);
        return subscription;
    }
    async delete(subscription) {
        const found = this.db.find(s => s.id === subscription.id);
        if (found) {
            found.isCanceled = true;
            return true;
        }
        return false;
    }
    async getById(id) {
        return this.db.find(s => s.id === id);
    }
    async getAll(filter) {
        if (!filter) {
            return this.db;
        }
        const keys = Object.keys(filter);
        return this.db.filter(s => {
            return keys.map(key => s[key] === filter[key])
                .reduce((value, item) => value && item, true);
        });
    }
}
exports.SubscriptionInMemoryDataHandler = SubscriptionInMemoryDataHandler;
//# sourceMappingURL=SubscriptionInMemoryDataHandler.js.map