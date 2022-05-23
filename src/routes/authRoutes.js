const { Router } = require('express')
const passport = require('../utils/passport')
const response = require('../utils/response')
const authFailHandling = require('../middlewares/authFailHandling')
const router = Router()

router.post(
  '/login',
  passport.authenticate('local', { failureMessage: true }),
  // authFailHandling,
  (req, res) => {
    const userData = {
      id: req.user.id,
      username: req.user.username,
      role: req.user.role,
    }

    return response.success(res, userData, 'Log in success!')
  }
)

router.post('/logout', (req, res) => {
  req.logout()

  return response.success(res, undefined, 'Log out success!')
})

module.exports = router
