const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const path = require('path')
const NodeMailer = require('../utils/nodemailer.js')

usersRouter.get('/', async (req, res) => {
  const users = await User
    .find({})
    .populate('taskTemplates', { name: 1 })
  res.json(users)
})

// Route for user sign-up
usersRouter.post('/', async (req, res) => {
  // Get the email and password from the request body.
  const { email, password } = req.body
  // Check to see if the email supplied is already stored in the database. If so, return an error message.
  const existingUser = await User.findOne({ email })
  if (existingUser) {
    return res.status(400).json({
      error: 'Email already in use'
    })
  }
  // Generate a password hash to be stored in the database.
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  // Generate a json web token to be used as a confirmationCode in the verification email.
  const confirmationCode = jwt.sign(email, process.env.SECRET)
  
  const user = new User({
    email,
    passwordHash,
    confirmationCode
  })
  
  const savedUser = await user.save((err) => {
    if (err) return res.status(500).send({ message: err })
  })

  NodeMailer.sendConfirmationEmail(
    email,
    confirmationCode
  )

  res.status(200).send({ message: 'A verification link has been sent to your email!' })
})

usersRouter.get('/:confirmationCode', (req, res, next) => {
  User.findOne({
    confirmationCode: req.params.confirmationCode,
  }).then((user) => {
    if (!user) {
      return res.status(404).send({ message: 'User not found.' })
    }
    user.status = 'Active'
    user.save((err) => {
      if (err) {
        return res.status(500).send({ message: err })
      }
    })

    res.status(200)
    // res.sendFile(path.join(__dirname, '..', 'build', 'index.html'))

  }).catch((e) => console.log('error', e))
})

// console.log(__dirname)      // "/Users/Sam/dirname-example/src/api"
// console.log(process.cwd())  // "/Users/Sam/dirname-example"

const getTokenFrom = req => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

usersRouter.delete('/', async (req, res, next) => {
  try {
    const token = getTokenFrom(req)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!decodedToken.id) {
      return res.status(401).json({ error: 'token missing or invalid' })
    }
    await User.findByIdAndRemove(decodedToken.id)
    res.status(204).end()
  } catch (error) {
    next(error)
  }
})

module.exports = usersRouter