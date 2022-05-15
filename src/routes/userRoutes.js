const { Router } = require('express')
const { userController } = require('../controllers')
const { validateRequestSchema } = require('../middlewares')

const router = Router()

router
  .route('/users')
  .post(
    validateRequestSchema,
    userController.createUser
  )
  .get(userController.getUsers)

router
  .route('/users/:id')
  .get(userController.getUserById)
  .delete(userController.deleteUserById)
  .put(
    validateRequestSchema,
    userController.updateUserById
  )

module.exports = router