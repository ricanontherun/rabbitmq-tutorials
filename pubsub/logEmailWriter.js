// This rabbitmq consumer will send an email to the dev team when a message (a log) is of critical level.

const rabbitError = require('../errors')
const rabbit = require('../rabbit')

rabbit('localhost').then(({connection, channel}) => {
  channel.assertExchange('logs', 'fanout', {durable: false})

  channel.assertQueue('', {exclusive: true}).then((queue) => {
    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue.queue)

    channel.bindQueue(queue.queue, 'logs', '').then(() => {
      channel.consume(queue.queue, (message) => {
        console.log(`Sending log '${message.content.toString()}' to someone's email!`)
      })
    }).catch((err) => {
      rabbitError('bindQueue', err)
    })
  }).catch((err) => {
    rabbitError('assertQueue', err)
  })
})
