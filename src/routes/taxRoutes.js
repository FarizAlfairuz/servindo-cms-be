const { Router } = require('express')
const { taxController } = require('../controllers')
const { validateRequestSchema, checkRole } = require('../middlewares')

const router = Router()

router
  .route('/taxes')
  .post(
    checkRole(['superadmin', 'finance']),
    validateRequestSchema,
    taxController.createTax
  )
  .get(
    checkRole(['superadmin', 'finance']),
    taxController.getTaxs
  )

router
  .route('/taxes/:id')
  .get(
    checkRole('superadmin', 'finance'),
    taxController.getTaxById
  )
  .delete(
    checkRole(['superadmin', 'finance']),
    taxController.deleteTaxById
  )
  .put(
    checkRole(['superadmin', 'finance']),
    validateRequestSchema,
    taxController.updateTaxById
  )

module.exports = router
