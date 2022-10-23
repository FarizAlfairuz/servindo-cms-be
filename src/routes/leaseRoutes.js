const { Router } = require('express')
const multer = require('multer')
const { leaseController } = require('../controllers')
const { checkRole } = require('../middlewares')
const { getStorage } = require('../utils/cloudinary')

const storage = getStorage('leases')
const upload = multer({ storage })

const router = Router()

router
  .route('/leases')
  .post(
    checkRole(['superadmin', 'marketing']),
    upload.single('image'),
    leaseController.createLease
  )
  .get(checkRole(['superadmin', 'marketing']), leaseController.getLeases)

module.exports = router