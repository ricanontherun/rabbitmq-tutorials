const rabbit = require('amqplib')
const {queue, message} = require('./capture')
const {rabbitError} = require('../errors')

rabbit.connect("amqp:localhost")
  .then((connection) => {
    connection.createChannel()
      .then((channel) => {
        // Create the queue if not already created.
        // The created queue will be capable of surviving broker restarts (messages are persisted to disk)
        channel.assertQueue(queue, {durable: true})

        const work = new Array(10).fill(1)

        work.forEach((number) => {
          channel.sendToQueue(queue, Buffer.from(number.toString()), {persistent: true})
        })

        // There MUST be a better way to handle closing the connection after a message is sent?
        setTimeout(() => {
          connection.close()
          process.exit(0)
        }, 500  )
      })
      .catch((err) => {
        rabbitError('createChannel', err)
      })
  })
  .catch((err) => {
    rabbitError('connect', err)
  })
