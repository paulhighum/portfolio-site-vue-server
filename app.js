const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const cors = require('cors')

require('dotenv').config()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false}))
app.use(cors())

const mailer = require('./mailer')


app.post("/send", (req, res) => {
  const message = {
    from: process.env.FROM_EMAIL,
    to: process.env.TO_EMAIL,
    subject: "Site Contact Form",
    text: `From: ${req.body.name} \n Email: ${req.body.email} \n Sent: ${new Date()} \n Message: ${req.body.message}`
  }
  mailer
    .sendMessage(message)
    .then(() => {
      res.json({
        message: "Message Sent"
      })
    })
    .catch(error => {
      res.status(500)
      res.json({
        error: error.message,
        stack: error.stack
      })
    })
})

module.exports = app
