const rabbit = require('../rabbit')

rabbit('localhost').then(({connection, channel}) => {
  // Make sure the exchange is created. Again, this is fanout exchange which routes all incoming messages
  // to bound queues.
  channel.assertExchange('logs', 'fanout', {durable: false})

  // Create a new unique queue (empty queue name) for this consumer only.
  // We set exclusive to true so that after this consumer's connection has been terminated, the queue will be deleted.
  // It's important to remember that a message placed on a queue can only be processed by 1 consumer. That's why we bind the
  // newly created queue to the exchange...this tells the exchange that there is a new queue it should send to. One queue per consumer
  // bound the exchange allows multiple consumers to receive the same message. Be it for redundancy, or just special handling of messages per consumer.
  channel.assertQueue('', {exclusive: true}).then((queue) => {
    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue.queue)

    // Now we need to bind the newly created queue to the exchange. Again, the important part is that
    // the queue is exclusive to this consumer, once the consumer disconnects, the queue dies. The queue is also
    // unique among the other queues, because we've allowed rabbitmq to create it for us, with a unique name. This means
    // that many consumers can easily bind their own personal queues to the common exchange, handling redundant messages in their own
    // preferred way.
    channel.bindQueue(queue.queue, 'logs', '')

    channel.consume(queue.queue, (msg) => {
      console.log(" [x] %s", msg.content.toString())
    }, {noAck: true})
  }).catch(console.error)
}).catch(console.error)