const rabbit = require('../rabbit')
const {format} = require('util')

rabbit('localhost').then(({connection, channel}) => {
  const message = process.argv[2] || 'An event occurred'
  const logMessage = format('%s: %s', (new Date()).toLocaleString('en-US'), message)

  // Ensure an exchange called logs exists. It will not persist messages to disk, and it will simply forward
  // all messages to all consumers of the 'logs' exchange.
  channel.assertExchange('logs', 'fanout', {durable: false})

  // Publish a message to the logs exchange.
  channel.publish('logs', '', Buffer.from(logMessage))

  setTimeout(() => {
    connection.close()
    process.exit(0)
  })
}).catch(console.error)