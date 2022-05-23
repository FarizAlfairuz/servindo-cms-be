const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const { User } = require('../models')

passport.use(
  new LocalStrategy(async (username, password, cb) => {
    try { 
      const user = await User.scope('withPassword').findOne({ where: { username } })

      // user not found
      if (!user) return cb(null, false, { message: 'Incorrect username or password.' })

      // password doesn't match
      const compare = await bcrypt.compare(password, user.password)

      if (!compare) {
        return cb(null, false, { message: 'Incorrect username or password.' })
      }

      // password match
      return cb(null, user)

    } catch (err) {
      console.log(err)
        return cb(err)
    }
  })
)

passport.serializeUser((user, cb) => {
  return cb(null, user.id)
})

passport.deserializeUser((id, cb) => {
  User.findByPk(id)
    .then((user) => {
      return cb(null, user)
    })
    .catch((err) => {
      return cb(err)
    })
})

module.exports = passport