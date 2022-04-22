const config = require('./utils/config')
const express = require('express')
const path = require('path')
const app = express()
const cors = require('cors')
const loginRouter = require('./controllers/login')
const usersRouter = require('./controllers/users')
const taskTemplatesRouter = require('./controllers/taskTemplates')
const tasksRouter = require('./controllers/tasks')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

logger.info(`Connecting to ${config.MONGODB_URI}`)

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch(error => {
    logger.error(`error connecting to MongoDB ${error.message}`)
  })

app.use(cors())
app.use(express.static(path.join(__dirname, 'build')))
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'))
})
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/login', loginRouter)
app.use('/api/users', usersRouter)
app.use('/api/tasktemplates', taskTemplatesRouter)
app.use('/api/tasks', tasksRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app