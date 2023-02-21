import { IDataHandler, Subscription } from "@internal/common";

export class SubscriptionInMemoryDataHandler implements IDataHandler<Subscription> {
    private db: Array<Subscription>;

    constructor() {
        this.db = [];
    }

    async add(subscription: Subscription): Promise<Subscription> {
        subscription.id = (this.db.length + 1).toString();
        this.db.push(subscription);

        return subscription;
    }

    async delete(subscription: Subscription): Promise<boolean> {
        const found = this.db.find(s => s.id === subscription.id);
        if (found) {
            found.isCanceled = true;
            return true;
        }

        return false;
    }

    async getById(id: unknown): Promise<Subscription> {
        return this.db.find(s => s.id === id) as unknown as Subscription;
    }

    async getAll(filter?: Partial<Record<keyof Subscription, unknown>> | undefined): Promise<Subscription[]> {
        if (!filter) {
            return this.db;
        }

        const keys = Object.keys(filter) as Array<keyof Subscription>;
        return this.db.filter(s => {
            return keys.map(key => s[key] === filter[key])
                    .reduce((value,  item) => value && item, true)
        });
    }
}