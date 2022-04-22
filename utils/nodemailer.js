const nodemailer = require('nodemailer')
const config = require('./config')

const smtpEmail = config.SMTP_EMAIL
const smtpPass = config.SMTP_PASS

const transporter = nodemailer.createTransport({
  service: 'gmail',
  port: 587,
  secure: false,
  auth: {
    user: smtpEmail,
    pass: smtpPass,
  }
})

{/* <a href=http://localhost:3000/api/users/${confirmationCode}>Click here</a> */}

sendConfirmationEmail = (email, confirmationCode) => {
  console.log('Check')
  transporter.sendMail({
    from: smtpEmail,
    to: email,
    subject: "Lemontime Account Confirmation",
    html: 
      `<div>
        <h1>Email Confirmation</h1>
        <h2>Hello!</h2>
        <a href=https://stark-everglades-16940.herokuapp.com/api/users/${confirmationCode}>Click here</a>
      </div>`
  }).catch(err => console.log(err))
}

module.exports = sendConfirmationEmail