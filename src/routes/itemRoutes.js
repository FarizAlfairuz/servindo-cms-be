const { Router } = require('express')
const { itemController } = require('../controllers')
const { validateRequestSchema, checkRole } = require('../middlewares')

const router = Router()

router
  .route('/items')
  .post(
    checkRole(['superadmin', 'purchasing', 'marketing']),
    validateRequestSchema,
    itemController.createItem
  )
  .get(
    checkRole(['superadmin', 'purchasing', 'marketing']),
    itemController.getItems
  )

router
  .route('/items/:id')
  .get(
    checkRole('superadmin', 'purchasing', 'marketing'),
    itemController.getItemById
  )
  .delete(
    checkRole(['superadmin', 'purchasing', 'marketing']),
    itemController.deleteItemById
  )
  .put(
    checkRole(['superadmin', 'purchasing', 'marketing']),
    validateRequestSchema,
    itemController.updateItemById
  )

module.exports = router
