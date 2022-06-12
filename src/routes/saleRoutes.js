const { Router } = require('express')
const { saleController } = require('../controllers')
const { checkRole } = require('../middlewares')

const router = Router()

router
  .route('/sales')
  .post(checkRole(['superadmin', 'marketing']), saleController.createSale)
  .get(checkRole(['superadmin', 'marketing']), saleController.getSales)

router
  .route('/balance')
  .get(checkRole(['superadmin', 'finance']), saleController.getBalance)

module.exports = router
