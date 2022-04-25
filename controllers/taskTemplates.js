const taskTemplatesRouter = require('express').Router()
const TaskTemplate = require('../models/taskTemplate')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const getTokenFrom = req => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

taskTemplatesRouter.get('/', async (req, res) => {
  const token = getTokenFrom(req)
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!decodedToken.id) {
    return res.status(401).json({ error: 'token missing or invalid' })
  }
  
  const user = await User.findById(decodedToken.id).populate('taskTemplates')
  const taskTemplates = user.taskTemplates
  res.json(taskTemplates)
})

taskTemplatesRouter.post('/', async (req, res) => {
  const body = req.body
  const token = getTokenFrom(req)
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!decodedToken.id) {
    return res.status(401).json({ error: 'token missing or invalid' })
  }
  const user = await User.findById(decodedToken.id)

  const taskTemplate = new TaskTemplate({
    name: body.name,
    user: user._id,
    tasks: body.tasks
  })

  const savedTaskTemplate = await taskTemplate.save()
  user.taskTemplates = user.taskTemplates.concat(savedTaskTemplate._id)
  await user.save()

  res.json(savedTaskTemplate)
})

taskTemplatesRouter.delete('/:id', async (req, res, next) => {
  const token = getTokenFrom(req)
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!decodedToken.id) {
    return res.status(401).json({ error: 'token missing or invalid' })
  }
  const user = await User.findById(decodedToken.id)

  const userTemplates = user.taskTemplates

  const userTemplateStrings = userTemplates.map(template => {
    return template.toString()
  })

  const filteredTemplates = userTemplateStrings.filter(templateId => {
    return templateId !== req.params.id
  })

  user.taskTemplates = filteredTemplates
  await user.save()

  await TaskTemplate.findByIdAndRemove(req.params.id)
  res.status(204).end()

  // .catch(error => next(error))
})

module.exports = taskTemplatesRouter