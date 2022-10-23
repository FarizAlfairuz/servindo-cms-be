const { Router } = require('express')
const multer = require('multer')
const { saleController } = require('../controllers')
const { checkRole } = require('../middlewares')
const { getStorage } = require('../utils/cloudinary')

const storage = getStorage('sales')
const upload = multer({ storage })

const router = Router()

router
  .route('/sales')
  .post(
    checkRole(['superadmin', 'marketing']),
    upload.single('image'),
    saleController.createSale
  )
  .get(checkRole(['superadmin', 'marketing']), saleController.getSales)

router
  .route('/balance')
  .get(checkRole(['superadmin', 'finance']), saleController.getBalance)

module.exports = router
