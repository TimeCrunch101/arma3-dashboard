
if (process.env.NODE_ENV !== 'production') require('dotenv').config()
const express = require('express');
const rateLimit = require('express-rate-limit')
// const https = require('https');
// const fs = require('fs');
const {create} = require('./config/db')
create().then((res) => {
  console.info('Database Initialized')
}).catch((err) => {
  console.error(err)
})
const port = 8080
const app = express()
const {initArmaServiceWatcher} = require('./controllers/spawnController')
const initGetRouter = require('./routes/getRouter')

// var key = fs.readFileSync(__dirname + '/certs/selfsigned.key');
// var cert = fs.readFileSync(__dirname + '/certs/selfsigned.crt');
// var options = {
//   key: key,
//   cert: cert
// };

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 100,
	standardHeaders: true,
	legacyHeaders: false,
})

const cors = require("cors")

if (process.env.NODE_ENV !== 'production') {
  app.use(cors({
      origin: 'http://127.0.0.1:5173',
      credentials: true
  }))
}

app.use(limiter)
app.use(express.urlencoded({extended: false}))
app.use(express.json())

// const server = https.createServer(options, app);

initGetRouter(app)

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(__dirname + '/public'))
  console.warn('PRODUCTION')
  app.get(/.*/, (req, res) => {
    res.sendFile(__dirname + '/public/index.html')
  })
}

app.listen(port, console.info(`API: http://localhost:${port}/`))

initArmaServiceWatcher()
require('./socketServer')