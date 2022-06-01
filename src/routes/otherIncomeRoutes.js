const { Router } = require('express')
const { otherIncomeController } = require('../controllers')
const { validateRequestSchema, checkRole } = require('../middlewares')

const router = Router()

router
  .route('/otherIncomes')
  .post(
    checkRole(['superadmin', 'finance']),
    validateRequestSchema,
    otherIncomeController.createOtherIncome
  )
  .get(
    checkRole(['superadmin', 'finance']),
    otherIncomeController.getOtherIncomes
  )

router
  .route('/otherIncomes/:id')
  .get(
    checkRole('superadmin', 'finance'),
    otherIncomeController.getOtherIncomeById
  )
  .delete(
    checkRole(['superadmin', 'finance']),
    otherIncomeController.deleteOtherIncomeById
  )
  .put(
    checkRole(['superadmin', 'finance']),
    validateRequestSchema,
    otherIncomeController.updateOtherIncomeById
  )

module.exports = router
