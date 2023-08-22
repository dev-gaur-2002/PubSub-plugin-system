const publishNewMessage = async (client, topicName, payloadData) => {
    const data = Buffer.from(JSON.stringify(payloadData));
    const message = await client.topic(topicName).publish(data);

    console.log("message published " + message);
    return message;
};

module.exports = {
    publishNewMessage,
};
