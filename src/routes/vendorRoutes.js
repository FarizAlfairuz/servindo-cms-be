const { Router } = require('express')
const { vendorController } = require('../controllers')
const { validateRequestSchema, checkRole } = require('../middlewares')

const router = Router()

router
  .route('/vendors')
  .post(
    checkRole(['superadmin', 'purchasing']),
    validateRequestSchema,
    vendorController.createVendor
  )
  .get(
    checkRole(['superadmin', 'purchasing']),
    vendorController.getVendors
  )

router
  .route('/vendors/:id')
  .get(
    checkRole(['superadmin', 'purchasing']),
    vendorController.getVendorById
  )
  .delete(
    checkRole(['superadmin', 'purchasing']),
    vendorController.deleteVendorById
  )
  .put(
    checkRole(['superadmin', 'purchasing']),
    validateRequestSchema,
    vendorController.updateVendorById
  )

module.exports = router
