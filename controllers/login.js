const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')
const usersRouter = require('./users')

loginRouter.post('/', async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })

  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash)
    
  if (!(user && passwordCorrect)) {
    return res.status(401).json({
      error: 'Invalid email or password'
    })
  }

  if (user.status !== 'Active') {
    return res.status(401).json({
      error: 'Please verify your email'
    })
  }

  const userForToken = {
    email: user.email,
    id: user._id,
  }

  const token = jwt.sign(userForToken, process.env.SECRET)

  res.status(200).send({ token, email: user.email })
})

module.exports = loginRouter