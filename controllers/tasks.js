const tasksRouter = require('express').Router()
const task = require('../models/task')
const Task = require('../models/task')

// Get the entire tasks array
tasksRouter.get('/', (req, res) => {
  Task.find({}).then(tasks => {
    res.json(tasks)
  })
})

// Get a single task object
tasksRouter.get('/:id', (req, res, next) => {
  Task.findById(req.params.id)
    .then(task => {
      if (note) {
        res.json(task)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})
// Create a new task
tasksRouter.post('/', (req, res) => {
  const body = req.body

  if (body.name === undefined) {
    return res.status(400).json({error: 'content missing'})
  }

  const task = new Task({
    name: body.name,
    dur: body.dur,
    note: body.note,
    blocksCompleted: body.blocksCompleted
  })

  task.save().then(savedNote => {
    res.json(savedNote)
  })
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