const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const accountsRouter = require('express').Router()
const User = require('../models/user')

accountsRouter.put('/', async (req, res) => {
  const email = req.body.email

  const user = await User.findOne({ email })

  if(user === null) {
    return res.status(401).json({
      error: 'Email not found'
    })
  }

  const resetToken = jwt.sign({ email }, process.env.SECRET)

  res.status(202).send({ email, resetToken })
})

accountsRouter.put('/:resetToken', async (req, res) => {
  // Get token from the URL
  const token = req.params.resetToken
  // Use the jwt.verify method to decode the token
  const decodedToken = jwt.verify(token, process.env.SECRET)
  // Check the database for an email matching the decoded token email
  const user = await User.findOne({ email: decodedToken.email })
  // Get the new user password from the request
  const password = req.body.password
  // Generate a new passwordHash using bcrypt.hash
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  user.passwordHash = passwordHash
  user.save((err) => {
    if (err) {
      return res.status(500).send({ message: err })
    }
  })

  res.status(204).json({
    message: 'You have successfully reset your password'
  })

})

module.exports = accountsRouter