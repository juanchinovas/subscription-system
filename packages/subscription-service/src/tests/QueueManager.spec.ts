import { ConsoleLogger, Subscription } from "@internal/common";
import { expect } from "chai";
import Sinon from "sinon";
import {QueueManager} from "../managers/QueueManager";


describe("QueueManager", () => {
    let queueManager: QueueManager;
    let configReader: any;
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
        mockChannel = {
            sendToQueue: Sinon.stub().returns(true),
            close: Sinon.fake()
        };
        queueManager = new QueueManager(configReader, logger);

        // mocking call to private methods to jump mq connection
        // @ts-ignore
        Sinon.stub(queueManager, "connectQueue" as keyof QueueManager).callsFake(() => {
            // @ts-ignore
            queueManager.readMQServerConfig();
            return Promise.resolve([mockConnection, mockChannel])
        })
    });

    afterEach(() => Sinon.restore());

    it("when the connection with the mq server cannot be stablished enqueue return false", async () => {
        // @ts-ignore
       queueManager.connectQueue.restore();
        // @ts-ignore
        Sinon.stub(queueManager, "connectQueue" as keyof QueueManager).resolves([]);

       expect(await  queueManager.enqueue({} as Subscription)).to.be.false;
    });

    it("should send message to the mq server", async () => {
        expect(await queueManager.enqueue({} as Subscription)).to.be.true;
    });

    it("should close connection with mq server after send the message", async () => {
        await queueManager.enqueue({} as Subscription)
        expect(mockConnection.close.calledOnce).to.be.true;
        expect(mockChannel.close.calledOnce).to.be.true;
    });
})