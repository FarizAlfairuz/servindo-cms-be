require('dotenv').config()
const cors = require('cors')
const express = require('express')
const session = require('express-session')
const SequelizeStore = require('connect-session-sequelize')(session.Store)

const fs = require('fs')
const http = require('http')
const https = require('https')
const path = require('path')

const passport = require('./utils/passport')

const sessionConfig = require('./config/sessionConfig')
const { connectDB, sequelize } = require('./utils/database')

const routes = require('./routes')

const app = express()
const httpPort = process.env.HTTP_PORT || 8080
const httpsPort = process.env.HTTPS_PORT || 8443
// const privateKey = fs.readFileSync(path.join(__dirname, '../cert/private.key'))
// const certificate = fs.readFileSync(
//   path.join(__dirname, '../cert/certificate.crt')
// )

const sessionStore = new SequelizeStore({
  db: sequelize,
})
const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  credentials: true,
  optionSuccessStatus: 200,
}
// const sslOptions = {
//   key: privateKey,
//   cert: certificate,
// }
sessionStore.sync()

// Middleware
app.use(cors(corsOptions))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(session(sessionConfig(sessionStore)))
app.use(passport.authenticate('session'))
app.use(passport.initialize())
app.use(passport.session())

// Routes
Object.keys(routes).forEach((route) => {
  app.use('/api', routes[route])
})

const httpServer = http.createServer(app)
// const httpsServer = https.createServer(sslOptions, app)

connectDB().then(async () => {
  await httpServer.listen(httpPort)
  // await httpsServer.listen(httpsPort)
  console.log(`Server is running on port ${httpPort} & ${httpsPort}`)
})
