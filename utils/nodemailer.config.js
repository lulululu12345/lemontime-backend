const nodemailer = require('nodemailer')
const config = require('./config')

const user = config.USER
const pass = config.PASS

const transport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: user,
    pass: pass,
  }
})

sendConfirmationEmail = (email, confirmationCode) => {
  console.log('Check')
  transport.sendMail({
    from: user,
    to: email,
    subject: "Lemontime Account Confirmation",
    html: 
      `<div>
        <h1>Email Confirmation</h1>
        <h2>Hello!</h2>
        <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
        <a href=http://localhost:8081/confirm/${confirmationCode}>Click here</a>
      </div>`
  }).catch(err => console.log(err))
}

module.exports = sendConfirmationEmail