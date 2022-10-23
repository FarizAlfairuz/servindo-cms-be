const { Router } = require('express')
const multer = require('multer')
const { taxController } = require('../controllers')
const { validateRequestSchema, checkRole } = require('../middlewares')
const { getStorage } = require('../utils/cloudinary')

const storage = getStorage('taxes')
const upload = multer({ storage })

const router = Router()

router
  .route('/taxes')
  .post(
    checkRole(['superadmin', 'finance']),
    upload.single('image'),
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
    checkRole(['superadmin', 'finance']),
    taxController.getTaxById
  )
  .delete(
    checkRole(['superadmin', 'finance']),
    taxController.deleteTaxById
  )
  .put(
    checkRole(['superadmin', 'finance']),
    upload.single('image'),
    validateRequestSchema,
    taxController.updateTaxById
  )

module.exports = router
