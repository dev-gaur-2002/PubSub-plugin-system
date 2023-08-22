const express = require("express");
const { PubSub } = require("@google-cloud/pubsub");
const { EventLogger } = require("./logger/logger");
require("dotenv").config();

const server = express();

const psClient = new PubSub();
const subscriptionName = "logger";
const time = 300;

const logger = new EventLogger();

const sub = psClient.subscription(subscriptionName);

const callbackOnPull = (msg) => {
    console.log(`Message [${msg.id}] received: `);
    LogData(msg);
    msg.ack();
};

const LogData = (msg) => {
    logger.info(`Message [${msg.id}] received.`, { success: true });
};

sub.on("message", callbackOnPull);

setTimeout(() => {
    sub.removeListener("message", callbackOnPull);
}, time * 1000);

server.listen(process.env.LOG_PORT, () =>
    console.log(
        `Logging server started running on port ${process.env.LOG_PORT}.`,
    ),
);
