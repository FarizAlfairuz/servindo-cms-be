const { Router } = require('express')
const passport = require('../utils/passport')

const router = Router()

router.post(
  '/login',
  passport.authenticate('local', { failureMessage: true }),
  (req, res) => {
    const userData = {
      id: req.user.id,
      username: req.user.username,
      role: req.user.role,
    }

    res.status(200).json({
      success: true,
      message: 'Log in success.',
      data: userData
    })
  }
)

router.post('/logout', (req, res) => {
  req.logout()

  return res.status(200).json({
    success: true,
    message: 'Log out success.',
  })
})

module.exports = router
