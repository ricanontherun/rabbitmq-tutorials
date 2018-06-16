exports.rabbitError = (event, message) => {
  console.error(`RabbitMQ: ${event}: ${message}`)
}