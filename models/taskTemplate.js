const mongoose = require('mongoose')

const taskTemplateSchema = new mongoose.Schema({
  name: String,
  tasks: [
    {
      type: mongoose.Schema.type.ObjectId,
      ref: 'Task'
    }
  ]
})

taskTemplateSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('TaskTemplate', taskTemplateSchema)