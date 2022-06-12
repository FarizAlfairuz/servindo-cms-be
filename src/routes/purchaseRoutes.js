const { Router } = require('express')
const { purchaseController } = require('../controllers')
const { checkRole } = require('../middlewares')

const router = Router()

router
  .route('/purchases')
  .post(
    checkRole(['superadmin', 'purchasing']),
    purchaseController.createPurchase
  )
  .get(
    checkRole(['superadmin', 'purchasing', 'finance']),
    purchaseController.getPurchases
  )

module.exports = router
