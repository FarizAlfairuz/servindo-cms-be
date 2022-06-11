const { Router } = require('express')
const { financialStatementController } = require('../controllers')
const { checkRole } = require('../middlewares')

const router = Router()

router
  .route('/statements')
  .get(
    checkRole(['superadmin', 'finance']),
    financialStatementController.getStatements
  )

router
  .route('/total')
  .get(
    checkRole(['superadmin', 'finance']),
    financialStatementController.getTotal
  )

module.exports = router
