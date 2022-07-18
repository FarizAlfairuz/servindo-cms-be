const { Router } = require('express')
const { financialStatementController } = require('../controllers')
const { checkRole } = require('../middlewares')
const statement = require('../utils/statements')

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

router
  .route('/statements/download')
  .get(
    checkRole(['superadmin', 'finance']),
    financialStatementController.downloadStatement
  )

module.exports = router
