require('dotenv').config()

const PORT = process.env.PORT
const MONGODB_URI = process.env.MONGODB_URI
const SMTP_EMAIL = process.env.SMTP_EMAIL
const SMTP_PASS = process.env.SMTP_PASS


module.exports = {
  MONGODB_URI,
  PORT,
  SMTP_EMAIL,
  SMTP_PASS
}