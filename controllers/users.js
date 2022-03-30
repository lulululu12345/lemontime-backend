const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (req, res) => {
  const users = await User
    .find({})
    .populate('taskTemplates', { name: 1 })
  res.json(users)
})

usersRouter.post('/', async (req, res) => {
  const { email, password } = req.body

  const existingUser = await User.findOne({ email })
  if (existingUser) {
    return res.status(400).json({
      error: 'email already in use'
    })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    email,
    passwordHash,
  })

  const savedUser = await user.save()

  const userForToken = {
    email: savedUser.email,
    id: savedUser.id,
  }

  const token = jwt.sign(userForToken, process.env.SECRET)

  res.status(200).send({ token, email: user.email })
})

module.exports = usersRouter