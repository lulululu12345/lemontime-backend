require('dotenv').config()

const PORT = process.env.PORT
const MONGODB_URI = process.env.MONGODB_URI
const USER = process.env.USER
const PASS = process.env.PASS


module.exports = {
  MONGODB_URI,
  PORT,
  USER,
  PASS
}