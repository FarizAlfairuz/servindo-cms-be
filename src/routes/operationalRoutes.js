const { Router } = require('express')
const multer = require('multer')
const { operationalController } = require('../controllers')
const { validateRequestSchema, checkRole } = require('../middlewares')
const { getStorage } = require('../utils/cloudinary')

const storage = getStorage('operationals')
const upload = multer({ storage })

const router = Router()

router
  .route('/operationals')
  .post(
    checkRole(['superadmin', 'finance']),
    upload.single('image'),
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
    upload.single('image'),
    validateRequestSchema,
    operationalController.updateOperationalById
  )

module.exports = router
