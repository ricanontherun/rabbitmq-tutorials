module.exports = {
  queue: process.argv[2] || 'my-queue',
  message: process.argv.slice(3).join(' ') || 'my-message'
}