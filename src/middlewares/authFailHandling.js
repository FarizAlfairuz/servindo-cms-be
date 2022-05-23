const passport = require('../utils/passport')

module.exports = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err)
    }

    if (info) {
      return res.status(401).json({ message: info.message })
    }

    if (!user) {
      return res.status(401).json({ message: 'Not authenticated.' })
    }

    req.user = user

    return next()
  })(req, res, next)
}
