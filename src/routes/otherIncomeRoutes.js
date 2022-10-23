const { Router } = require('express')
const multer = require('multer')
const { otherIncomeController } = require('../controllers')
const { validateRequestSchema, checkRole } = require('../middlewares')
const { getStorage } = require('../utils/cloudinary')

const storage = getStorage('otherIncomes')
const upload = multer({ storage })

const router = Router()

router
  .route('/otherIncomes')
  .post(
    checkRole(['superadmin', 'finance']),
    upload.single('image'),
    validateRequestSchema,
    otherIncomeController.createOtherIncome
  )
  .get(
    checkRole(['superadmin', 'finance']),
    otherIncomeController.getOtherIncomes
  )

router
  .route('/otherIncomes/:id')
  .get(
    checkRole(['superadmin', 'finance']),
    otherIncomeController.getOtherIncomeById
  )
  .delete(
    checkRole(['superadmin', 'finance']),
    otherIncomeController.deleteOtherIncomeById
  )
  .put(
    checkRole(['superadmin', 'finance']),
    upload.single('image'),
    validateRequestSchema,
    otherIncomeController.updateOtherIncomeById
  )

module.exports = router
