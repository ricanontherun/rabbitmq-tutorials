const rabbit = require('amqplib')
const {queue} = require('./capture')
const {rabbitError} = require('../errors')

const MAX_CONCURRENT_WORK = 2

rabbit.connect('amqp:localhost').then((connection) => {
  connection.createChannel()
    .then((channel) => {
      channel.assertQueue(queue, {durable: true})
      channel.prefetch(MAX_CONCURRENT_WORK)

      channel.consume(queue, function(message) {
        const seconds = message.message
        // Do some work.
        console.log(`Working for ${seconds} seconds`)

        setTimeout(() => {
          console.log('Done')

          // Tell the broker we've done our work, and it can dequeue the message.
          channel.ack(message)
        }, 1000 * seconds)
      })
    })
    .catch((err) => {
      rabbitError('createChannel', err)
    })
}).catch((err) => {
  rabbitError('connect', err)
})