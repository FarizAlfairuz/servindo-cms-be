const response = require('../utils/response')
const { userServices } = require('../services')
const { handleUniqueViolation } = require('../helpers/handleSequelizeErrors')

exports.createUser = async (req, res) => {
  try {
    const user = req.body

    const data = await userServices.create(user)

    return response.created(res, data, 'Successfully created user!')
  } catch (error) {
    console.log(error)

    if (error.name === 'SequelizeUniqueConstraintError') {
      const handledErrors = handleUniqueViolation(error)

      return response.conflict(res, handledErrors, 'Failed to create user!')
    }

    return response.internal_server_error(
      res,
      undefined,
      'Failed to create user!'
    )
  }
}

exports.getUsers = async (req, res) => {
  try {
    const data = await userServices.get(req.query)

    return response.success(res, data, 'Successfully retrieved users!')
  } catch (error) {
    console.log(error)

    return response.internal_server_error(
      res,
      undefined,
      'Failed to retrieve users!'
    )
  }
}

exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params

    const data = await userServices.getById(id)

    if (!data) return response.not_found(res, undefined, 'User not found!')

    return response.success(res, data, 'Successfully retrieved user!')
  } catch (error) {
    console.log(error)

    return response.internal_server_error(
      res,
      undefined,
      'Failed to retrieve user!'
    )
  }
}

exports.updateUserById = async (req, res) => {
  try {
    const { id } = req.params
    const updateData = req.body

    const data = await userServices.updateById(id, updateData)

    if (!data) return response.not_found(res, undefined, 'User not found!')

    return response.success(res, data, 'Successfully updated user!')
  } catch (error) {
    console.log(error)

    return response.internal_server_error(
      res,
      undefined,
      'Failed to update users!'
    )
  }
}

exports.deleteUserById = async (req, res) => {
  try {
    const { id } = req.params

    const data = await userServices.deleteById(id)

    if (!data) return response.not_found(res, undefined, 'User not found!')

    return response.success(res, undefined, 'Successfully deleted user!')
  } catch (error) {
    console.log(error)

    return response.internal_server_error(
      res,
      undefined,
      'Failed to delete user!'
    )
  }
}
