const { Router } = require('express')
const { customerController } = require('../controllers')
const { validateRequestSchema, checkRole } = require('../middlewares')

const router = Router()

router
  .route('/customers')
  .post(
    checkRole(['superadmin', 'marketing']),
    validateRequestSchema,
    customerController.createCustomer
  )
  .get(checkRole(['superadmin', 'marketing']), customerController.getCustomers)

router
  .route('/customers/:id')
  .get(checkRole(['superadmin', 'marketing']), customerController.getCustomerById)
  .delete(
    checkRole(['superadmin', 'marketing']),
    customerController.deleteCustomerById
  )
  .put(
    checkRole(['superadmin', 'marketing']),
    validateRequestSchema,
    customerController.updateCustomerById
  )

module.exports = router
