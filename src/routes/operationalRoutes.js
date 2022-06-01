const { Router } = require('express')
const { operationalController } = require('../controllers')
const { validateRequestSchema, checkRole } = require('../middlewares')

const router = Router()

router
  .route('/operationals')
  .post(
    checkRole(['superadmin', 'marketing']),
    validateRequestSchema,
    operationalController.createOperational
  )
  .get(checkRole(['superadmin', 'marketing']), operationalController.getOperationals)

router
  .route('/operationals/:id')
  .get(checkRole('superadmin', 'marketing'), operationalController.getOperationalById)
  .delete(
    checkRole(['superadmin', 'marketing']),
    operationalController.deleteOperationalById
  )
  .put(
    checkRole(['superadmin', 'marketing']),
    validateRequestSchema,
    operationalController.updateOperationalById
  )

module.exports = router
