const { Router } = require('express')
const multer = require('multer')
const { serviceController } = require('../controllers')
const { validateRequestSchema, checkRole } = require('../middlewares')
const { getStorage } = require('../utils/cloudinary')

const storage = getStorage('services')
const upload = multer({ storage })

const router = Router()

router
  .route('/services')
  .post(
    checkRole(['superadmin', 'marketing']),
    upload.single('image'),
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
    upload.single('image'),
    validateRequestSchema,
    serviceController.updateServiceById
  )

module.exports = router
