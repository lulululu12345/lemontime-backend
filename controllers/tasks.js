const tasksRouter = require('express').Router()
const Task = require('../models/task')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const usersRouter = require('./users')

const getTokenFrom = req => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

// Get the entire tasks array
tasksRouter.get('/', async (req, res) => {
  const tasks = await Task.find({}).populate('user', { email: 1 })
  res.json(tasks)
})

// Get a single task object
tasksRouter.get('/:id', (req, res, next) => {
  Task.findById(req.params.id)
    .then(task => {
      if (task) {
        res.json(task)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})

// Create a new task
tasksRouter.post('/', async (req, res, next) => {
  const body = req.body
  const token = getTokenFrom(req)
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!decodedToken.id) {
    return res.status.json({ error: 'token missing or invalid' })
  }
  // const user = await User.findById(decodedToken.id)
  const user = await User.findById(decodedToken.id)

  const task = new Task({
    name: body.name,
    dur: body.dur,
    note: body.note,
    blocksCompleted: body.blocksCompleted,
    user: user._id
  })

  const savedTask = await task.save()
  user.tasks = user.tasks.concat(savedTask._id)
  await user.save()

  res.json(savedTask)
})

// Delete a task
tasksRouter.delete('/:id', (req, res, next) => {
  Task.findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

// Update/edit a task
tasksRouter.put('/:id', (req, res, next) => {
  const body = req.body
  
  const task = {
    name: body.name,
    dur: body.dur,
    note: body.note,
    blocksCompleted: body.blocksCompleted
  }

  Task.findByIdAndUpdate(req.params.id, task, { new: true })
    .then(updateTask => {
      res.json(updateTask)
    })
    .catch(error => next(error))
})

module.exports = tasksRouter