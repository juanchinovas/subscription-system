import { ICacheProvider } from "@internal/common";
import { expect } from "chai";
import NodeCache from "node-cache";
import Sinon, { SinonSpy } from "sinon";
import { InMemoryCacheManager } from "../data/InMemoryCacheManager";

describe("inMemoryCacheManager", () => {
    let configProvider: any;
    
    describe("readThrough", () => {
        let fakeFallback: any;
        let cacheMemory: ICacheProvider;
        beforeEach(() => {
            configProvider = {
                readPrimitive: Sinon.fake.returns(1)
            };
            fakeFallback = Sinon.fake.resolves({});
            Sinon.stub(NodeCache.prototype, 'get').returns(null);
            Sinon.stub(NodeCache.prototype, 'set').returns(true);
            cacheMemory = new InMemoryCacheManager(configProvider);
        });

        afterEach(() => {
            Sinon.restore();
        });

        it("calls fallback when the info is not cached", async () => {
            await cacheMemory.readThrough("cache-key-01", fakeFallback);

            expect(fakeFallback.calledOnce).to.be.true;
        });

        it("should not call fallback when the info is cached", async () => {
            // @ts-ignore
            NodeCache.prototype.get.returns({});

            await cacheMemory.readThrough("cache-key-02", fakeFallback);

            expect(fakeFallback.calledOnce).to.not.be.true;
            // @ts-ignore
            expect(NodeCache.prototype.set.calledOnce).to.not.be.true;
        });

        it("should return the cached value", async () => {
            // @ts-ignore
            NodeCache.prototype.get.restore();
            Sinon.stub(NodeCache.prototype, 'get').returns({});

            const value = await (new InMemoryCacheManager(configProvider)).readThrough("cache-key-02", fakeFallback);

            expect(fakeFallback.calledOnce).to.not.be.true;
            expect(value).to.be.deep.eq({});
        });
    });

    describe("writeThrough", () => {
        let fakeFallback: SinonSpy;
        let cacheMemory: ICacheProvider;
        beforeEach(() => {
            fakeFallback = Sinon.fake.resolves({});
            configProvider = {
                readPrimitive: Sinon.fake.returns(1)
            };
            Sinon.stub(NodeCache.prototype, 'get').returns(null);
            Sinon.stub(NodeCache.prototype, 'set').returns(true);
            Sinon.stub(NodeCache.prototype, 'del');
            cacheMemory = new InMemoryCacheManager(configProvider);
        });

        afterEach(() => {
            Sinon.restore();
        });

        it("calls fallback and update the cache", async () => {
            await cacheMemory.writeThrough("cache-key-01", fakeFallback);

            expect(fakeFallback.called).to.be.true;
            // @ts-ignore
            expect(NodeCache.prototype.set.calledOnce).to.be.true;
        });

        it("removes the cached value when fallback return null", async () => {
            fakeFallback = Sinon.fake.resolves(null);

            const result = await cacheMemory.writeThrough("cache-key-02", fakeFallback);

            // @ts-ignore
            expect(NodeCache.prototype.del.calledOnce).to.be.true;
            // @ts-ignore
            expect(NodeCache.prototype.set.calledOnce).to.not.be.true;
            expect(result).to.be.true;
        });

        it("sets cached value when fallback return different of null", async () => {
            fakeFallback = Sinon.fake.resolves(45);

            await cacheMemory.writeThrough("cache-key-02", fakeFallback);

            // @ts-ignore
            expect(NodeCache.prototype.set.calledOnce).to.be.true;
        });

        it("returns new cached value when fallback return different of null", async () => {
            fakeFallback = Sinon.fake.resolves(45);

            const result = await cacheMemory.writeThrough("cache-key-02", fakeFallback);

            expect(result).to.be.eq(45);
        });

        it("returns new cached value", async () => {
            const mockCache: any = {};
            fakeFallback = Sinon.fake.resolves("cached");
            // @ts-ignore
            NodeCache.prototype.set.restore();
            Sinon.stub(NodeCache.prototype, 'set').callsFake((key, value) => {
                mockCache[key] = value;
                return true;
            });
            // @ts-ignore
            NodeCache.prototype.get.restore();
            Sinon.stub(NodeCache.prototype, 'get').callsFake((key) => mockCache[key]);

            const result = await (new InMemoryCacheManager(configProvider)).writeThrough("cache-key-02", fakeFallback);
            const readValue = await (new InMemoryCacheManager(configProvider)).readThrough("cache-key-02", fakeFallback);

            expect(result).to.be.eq(readValue);
        });
    });
});