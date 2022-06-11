const { Router } = require('express')
const { leasedItemController } = require('../controllers')
const { checkRole } = require('../middlewares')

const router = Router()

router
  .route('/leasedItems')
  .get(
    checkRole(['superadmin', 'marketing', 'purchasing']),
    leasedItemController.getLeasedItems
  )

module.exports = router
