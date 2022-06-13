const { Router } = require('express')
const { operationalController } = require('../controllers')
const { validateRequestSchema, checkRole } = require('../middlewares')

const router = Router()

router
  .route('/operationals')
  .post(
    checkRole(['superadmin', 'finance']),
    validateRequestSchema,
    operationalController.createOperational
  )
  .get(checkRole(['superadmin', 'finance']), operationalController.getOperationals)

router
  .route('/operationals/:id')
  .get(checkRole(['superadmin', 'finance']), operationalController.getOperationalById)
  .delete(
    checkRole(['superadmin', 'finance']),
    operationalController.deleteOperationalById
  )
  .put(
    checkRole(['superadmin', 'finance']),
    validateRequestSchema,
    operationalController.updateOperationalById
  )

module.exports = router
