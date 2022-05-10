require('dotenv').config()
const express = require('express')
const session = require('express-session')
const SequelizeStore = require('connect-session-sequelize')(session.Store)

const passport = require('./utils/passport')

const sessionConfig = require('./config/sessionConfig')
const { connectDB, sequelize } = require('./utils/database')

const routes = require('./routes')

const app = express()
const port = process.env.PORT || 8000
const sessionStore = new SequelizeStore({
  db: sequelize,
})
sessionStore.sync()

// Middleware
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(session(sessionConfig(sessionStore)))
app.use(passport.initialize())
app.use(passport.session())

// Routes
Object.keys(routes).forEach((route) => {
  app.use('/api', routes[route])
})

connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
  })
})
