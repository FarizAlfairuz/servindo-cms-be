const { Router } = require('express')
const multer = require('multer')
const { purchaseController } = require('../controllers')
const { checkRole } = require('../middlewares')
const { getStorage } = require('../utils/cloudinary')

const storage = getStorage('purchases')
const upload = multer({ storage })

const router = Router()

router
  .route('/purchases')
  .post(
    checkRole(['superadmin', 'purchasing']),
    upload.single('image'),
    purchaseController.createPurchase
  )
  .get(
    checkRole(['superadmin', 'purchasing', 'finance']),
    purchaseController.getPurchases
  )

module.exports = router
