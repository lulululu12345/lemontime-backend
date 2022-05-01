const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const accountsRouter = require('express').Router()
const User = require('../models/user')
const NodeMailer = require('../utils/nodemailer')

accountsRouter.put('/', async (req, res) => {
  const email = req.body.email

  const user = await User.findOne({ email })

  if(user === null) {
    return res.status(401).json({
      error: 'Email not found'
    })
  }

  const resetToken = jwt.sign({ email }, process.env.SECRET)

  NodeMailer.sendPasswordResetEmail(
    email,
    resetToken
  )

  res.status(202).json({
    message: 'Check your inbox for a link to reset your password'
  })
})

const getTokenFrom = req => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

accountsRouter.put('/:resetToken', async (req, res) => {
  console.log('here is the request: ', req)
  // Get token from the request using the getTokenFrom function
  // const token = getTokenFrom(req)
  const token = req.params.resetToken
  // Use the jwt.verify method to decode the token
  const decodedToken = jwt.verify(token, process.env.SECRET)
  // Print to the console
  console.log('decodedToken.email is: ', decodedToken.email)
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

  // res
  //   .status(204)
  //   .sendFile(path.join(__dirname, '..', 'build', 'index.html'))
  //   .json({
  //       message: 'You have successfully reset your password'
  //   })

  res.status(204).json({
    message: 'You have successfully reset your password'
  })

})

module.exports = accountsRouter