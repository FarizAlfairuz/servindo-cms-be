const { Router } = require('express')
const { serviceController } = require('../controllers')
const { validateRequestSchema, checkRole } = require('../middlewares')

const router = Router()

router
  .route('/services')
  .post(
    checkRole(['superadmin', 'marketing']),
    validateRequestSchema,
    serviceController.createService
  )
  .get(
    checkRole(['superadmin', 'marketing']),
    serviceController.getServices
  )

router
  .route('/services/:id')
  .get(
    checkRole('superadmin', 'marketing'),
    serviceController.getServiceById
  )
  .delete(
    checkRole(['superadmin', 'marketing']),
    serviceController.deleteServiceById
  )
  .put(
    checkRole(['superadmin', 'marketing']),
    validateRequestSchema,
    serviceController.updateServiceById
  )

module.exports = router
