require('dotenv').config()
const express = require('express')
const app = express()
const Task = require('./models/task')

app.use(express.json())

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
// Get  a single task object
app.get('/api/tasks/:id', (req, res) => {
  Task.findById(req.params.id).then(task => {
    res.json(task)
  })
})

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


const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})