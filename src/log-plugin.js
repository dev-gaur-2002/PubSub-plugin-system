const {PubSub} = require("@google-cloud/pubsub")

const Logger = require("./logger/logger")

require("dotenv").config();

const psClient = new PubSub();
const subscription = "logger"
const time = 100

const logger = new Logger();
const responses = psClient.subscription(subscription);

const handleMessage = (message)=>{
    console.log("message pulled ")
    logger.info(`Message with id ${message.id} recieved`, {success:true});
    message.ack();
}

responses.on('message',handleMessage);

setTimeout(()=>{
    responses.removeListener('message',handleMessage);
},time*1000);