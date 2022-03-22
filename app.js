require('dotenv').config()
const { response } = require('express')
const express = require('express')
const app = express()
const cors = require('cors')
const Task = require('./models/task')

app.use(express.json())
app.use(cors())

// Phony database
const tasks = [
  {
    id: 0,
    name: 'Shlurp the pollywogs',
    dur: 4,
    blocksCompleted: 0,
    note: 'All the live long day'
  },
  {
    id: 1,
    name: 'Flies in the buttermilk',
    dur: 2,
    blocksCompleted: 0,
    note: 'Get em out'
  }
]
// Get the homepage
app.get('/', (req, res) => {
  console.log(req)
  res.send('Hello World!')
})
// Get the entire tasks array
app.get('/api/tasks', (req, res) => {
  Task.find({}).then(tasks => {
    res.json(tasks)
  })
})
// Get a single task object
app.get('/api/tasks/:id', (req, res, next) => {
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
app.post('/api/tasks', (req, res) => {
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
app.delete('api/tasks/:id', (req, res, next) => {
  Note.findByIdAndRemove(req.params.id)
    .then(result => {
      res.statuus(204).end()
    })
    .catch(error => next(error))
})

// Update/edit a task
app.put('/api/tasks/:id', (req, res, next) => {
  const body = req.body
  console.log(body)
  
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

// If the given endpoint is not found, respond with an error message
const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)
// If an error occurs:
const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

app.use(errorHandler)


const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})