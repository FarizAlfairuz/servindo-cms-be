const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const { User } = require('../models')

passport.use(
  new LocalStrategy((username, password, cb) => {
    User.scope('withPassword')
      .findOne({ where: { username } })
      .then((user) => {
        // user not found
        if (!user) return cb(null, false)

        // password doesn't match
        if (!bcrypt.compare(password, user.password)) {
          return cb(null, false)
        }

        // password match
        return cb(null, user)
      })
      .catch((err) => {
        return cb(err)
      })
  })
)

passport.serializeUser((user, cb) => {
  return cb(null, user.id)
})

passport.deserializeUser((id, cb) => {
  User.finByPk(id)
    .then((user) => {
      return cb(null, user)
    })
    .catch((err) => {
      return cb(err)
    })
})

module.exports = passport