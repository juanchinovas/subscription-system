import { expect } from "chai";
import Sinon from "sinon";
import { QueueConsumer } from "../QueueConsumer";
import { ConsoleLogger } from "@internal/common";


describe("QueueConsumer", () => {
    let queueConsumer: QueueConsumer;
    let configReader: any;
    let consumers: Map<string, (msg: any) => void>;
    const queueName = "test";
    let mockConnection: any;
    let mockChannel: any;
    let logger: Sinon.SinonStubbedInstance<ConsoleLogger>;

    beforeEach(() => {
        logger = Sinon.createStubInstance(ConsoleLogger);
        configReader = {
            read: Sinon.fake.returns({queue: queueName})
        };
        mockConnection = {
            close: Sinon.fake()
        };
        consumers = new Map<string, (msg: any) => void>
        mockChannel = {
            consume: Sinon.stub().callsFake((queue: string, callbak) => {
                consumers.set(queue, callbak);
            }),
            ack: Sinon.fake(),
            close: Sinon.fake()
        };
        queueConsumer = new QueueConsumer(configReader, logger);

        // mocking call to private methods to jump mq connection
        // @ts-ignore
        Sinon.stub(queueConsumer, "connectQueue" as keyof QueueConsumer).callsFake(() => {
            // @ts-ignore
            queueConsumer.readMQServerConfig();
            return Promise.resolve([mockConnection, mockChannel])
        })
    });

    afterEach(() => Sinon.restore());

    it("throws when the connection with the mq server cannot be stablished", (done) => {
        // @ts-ignore
       queueConsumer.connectQueue.restore();

        Sinon.stub(queueConsumer, "connectQueue" as keyof QueueConsumer).resolves([])
        queueConsumer.consume()
        .then(() => done("Something went wrong"))
        .catch((error) => {
            expect(error).to.have.a.property("message", "Unable to connect to the mq server");
            done()
        });
    });

    it("should stablish connection with mq and wait for message", async () => {
        await queueConsumer.consume();
        expect(consumers.size).to.be.equal(1)
    });

    it("should notify observers when a new message is available", async () => {
        await queueConsumer.consume();
        const fakeObserver = {notify: Sinon.fake()}
        queueConsumer.registerObserver(fakeObserver);
        const observerQueue = consumers.get(queueName);
        observerQueue?.({
            content: JSON.stringify({
                campaignId: 45,
                consentFlag: 1,
                dateOfBirth: new Date(1990, 2, 2),
                email: "test@test.com",
            })
        });

        expect(fakeObserver.notify.calledOnce).to.be.true;
    });

    it("should notify mq server message was consumed", async () => {
        await queueConsumer.consume();
        const fakeObserver = {notify: Sinon.fake()}
        queueConsumer.registerObserver(fakeObserver);
        const observerQueue = consumers.get(queueName);

        observerQueue?.({
            content: JSON.stringify({
                campaignId: 45,
                consentFlag: 1,
                dateOfBirth: new Date(1990, 2, 2),
                email: "test@test.com",
            })
        });
        expect(mockChannel.ack.calledOnce).to.be.true;
    });

    it("should log an error if reading a message fail", async () => {
        await queueConsumer.consume();
        const fakeObserver = {notify: Sinon.fake()}
        queueConsumer.registerObserver(fakeObserver);
        const observerQueue = consumers.get(queueName);

        observerQueue?.({
            content: {}
        });
        
        expect(logger.error.calledOnce).to.be.true;
    });
})