const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const cors = require("cors")
const mailer = require('./mailer')

app.use(bodyParser.json())
app.use(cors())


app.post("/send", (req, res) => {
  const message = {
    from: process.env.FROM_MAIL,
    to: process.env.TO_MAIL,
    subject: "Site Contact Form",
    message: `From: ${req.body.name} \n Email: ${req.body.email} \n Sent: ${new Date()} \n Message: ${req.body.message}`
  }
  mailer
    .sendMessage(message)
    .then(() => {
      res.json({
        message: "Email Sent"
      })
    })
    .catch(error => {
      res.status(500)
      res.json({
        error: error
      })
    })
})

app.use((req, res, next) => {
  const err = new Error("Not Found")
  err.status = 404
  next(err)
})

// error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500)
  res.json({
    message: err.message,
    error: req.app.get("env") === "development" ? err.stack : {}
  })
})

module.exports = app
