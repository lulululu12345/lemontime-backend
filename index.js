const app = require('./app') // the actual Express application
const http = require('http')
const config = require('./utils/config')
const logger = require('./utils/logger')

const server = http.createServer(app)

const PORT = config.PORT
console.log('port', PORT)
server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`)
})