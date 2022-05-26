const { Router } = require('express')
const { changelogController } = require('../controllers')
const { checkRole } = require('../middlewares')


const router = Router()

router
  .route('/changelog')
  .get(
    checkRole(['superadmin', 'finance', 'marketing', 'purchasing', 'support']),
    changelogController.getChangelogs
  )

module.exports = router
