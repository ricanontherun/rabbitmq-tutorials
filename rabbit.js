const rabbit = require('amqplib')

const formatRabbitError = (event, error) => `RabbitMQ: ${event}: ${error}`

module.exports = (host) => {
  return new Promise((resolve, reject) => {
    rabbit.connect(`amqp://${host}`).then((connection) => {
      connection.createChannel()
        .then((channel) => {
          resolve({connection, channel})
        })
        .catch((err) => {
          reject(formatRabbitError('createChannel', err))
        })
    }).catch((err) => {
      reject(formatRabbitError('connect', err))
    })
  })
}