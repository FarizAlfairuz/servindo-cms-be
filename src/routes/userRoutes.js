const { Router } = require('express')
const { userController } = require('../controllers')
const { validateRequestSchema, checkRole } = require('../middlewares')

const router = Router()

router
  .route('/users')
  .post(
    checkRole(['superadmin']),
    validateRequestSchema,
    userController.createUser
  )
  .get(checkRole(['superadmin']), userController.getUsers)

router
  .route('/users/:id')
  .get(checkRole('superadmin'), userController.getUserById)
  .delete(checkRole(['superadmin']), userController.deleteUserById)
  .put(
    checkRole(['superadmin']),
    validateRequestSchema,
    userController.updateUserById
  )

module.exports = router
