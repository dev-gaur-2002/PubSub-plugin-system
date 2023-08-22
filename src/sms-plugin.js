const express = require("express");
const { PubSub } = require("@google-cloud/pubsub");

require("dotenv").config();

const server = express();

const psClient = new PubSub();
const time = 300;
const subscriptionName = "sms";

const sub = psClient.subscription(subscriptionName);
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_ACCOUNT_TOKEN;

const client = require("twilio")(accountSid, authToken);

const callbackOnPull = (msg) => {
    console.log(`Message [${msg.id}] received: `);
    message = JSON.parse(msg.data);
    let phoneNumber = message._fieldsProto.phoneNumber.stringValue;
    phoneNumber = "+91" + phoneNumber; // for indian numbers only
    console.log(phoneNumber);
    sendSms(phoneNumber);
    msg.ack();
};

const sendSms = (phoneNumber) => {
    client.messages
        .create({
            body: "Your application has been submitted in the portal",
            from: process.env.TWILIO_PHONE_NUMBER,
            to: phoneNumber,
        })
        .then((message) => console.log(message.sid))
        .catch((error) => {
            console.error(error);
        });
};

sub.on("message", callbackOnPull);

setTimeout(() => {
    sub.removeListener("message", callbackOnPull);
}, time * 1000);

server.listen(process.env.SMS_PORT, () =>
    console.log(`Sms server started running on port ${process.env.SMS_PORT}.`),
);
