const amqp = require("amqplib");
const config = require("./config");
const { json } = require("body-parser");

// Steps ->
// 1 : Connect to the rabbitmq server
// 2 : Create a new channel
// 3 : create the exchange
// 4 : create the queue
// 5 : bind the queue to the exchange
// 6 : consume messages form the queue

async function consumeMessage() {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();

  const exchangeName = config.rabbitMQ.exchangeName;
  await channel.assertExchange(exchangeName, "direct");

  const queue = await channel.assertQueue("WarningAndErrorQueue");

  await channel.bindQueue(queue.queue, exchangeName, "Warning");
  await channel.bindQueue(queue.queue, exchangeName, "Error");

  channel.consume(queue.queue, (msg) => {
    const data = JSON.parse(msg.content);
    console.log(data);
    channel.ack(msg);
  });
}

consumeMessage();
