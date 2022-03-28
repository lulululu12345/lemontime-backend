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

taskTemplatesRouter.post('/', async (req, res) => {
  const body = req.body
  const token = getTokenFrom(req)
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!decodedToken.id) {
    return res.status.json({ error: 'token missing or invalid' })
  }
  const user = await User.findById(decodedToken.id)
  console.log(body);

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

module.exports = taskTemplatesRouter