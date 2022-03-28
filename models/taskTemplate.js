const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
  name: String,
  dur: Number,
  note: String,
  blocksCompleted: Number,
})

const taskTemplateSchema = new mongoose.Schema({
  name: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  tasks: [taskSchema]
})

taskTemplateSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('TaskTemplate', taskTemplateSchema)