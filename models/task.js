const mongoose = require('mongoose')

const url = process.env.MONGO_URI

console.log(`Connecting to ${url}`)

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log(`error connecting to MongoDB ${error.message}`)
  })

const taskSchema = new mongoose.Schema({
  name: String,
  dur: Number,
  note: String,
  blocksCompleted: Number
})

taskSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Task', taskSchema)