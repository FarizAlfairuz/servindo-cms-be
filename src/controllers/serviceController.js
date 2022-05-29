const response = require('../utils/response')
const { serviceServices, changelogServices } = require('../services')
const { handleUniqueViolation } = require('../helpers/handleSequelizeErrors')

exports.createService = async (req, res) => {
  try {
    const service = req.body

    const data = await serviceServices.create(service)

    const changelog = {
      description: `Created service ${data.description}`,
      category: 'marketing',
      changedBy: req.user.id,
    }

    await changelogServices.create(changelog)

    return response.created(res, data, 'Successfully created service!')
  } catch (error) {
    console.log(error)

    if (error.name === 'SequelizeUniqueConstraintError') {
      const handledErrors = handleUniqueViolation(error)

      return response.conflict(res, handledErrors, 'Failed to create service!')
    }

    return response.internal_server_error(
      res,
      undefined,
      'Failed to create service!'
    )
  }
}

exports.getServices = async (req, res) => {
  try {
    const data = await serviceServices.get(req.query)

    return response.success(res, data, 'Successfully retrieved services!')
  } catch (error) {
    console.log(error)

    return response.internal_server_error(
      res,
      undefined,
      'Failed to retrieve services!'
    )
  }
}

exports.getServiceById = async (req, res) => {
  try {
    const { id } = req.params

    const data = await serviceServices.getById(id)

    if (!data) return response.not_found(res, undefined, 'Service not found!')

    return response.success(res, data, 'Successfully retrieved service!')
  } catch (error) {
    console.log(error)

    return response.internal_server_error(
      res,
      undefined,
      'Failed to retrieve service!'
    )
  }
}

exports.updateServiceById = async (req, res) => {
  try {
    const { id } = req.params
    const updateData = req.body

    const data = await serviceServices.updateById(id, updateData)

    if (!data) return response.not_found(res, undefined, 'Service not found!')

    const changelog = {
      description: `Edited service ${data.username}`,
      category: 'marketing',
      changedBy: req.user.id,
    }

    await changelogServices.create(changelog)

    return response.success(res, data, 'Successfully updated service!')
  } catch (error) {
    console.log(error)

    return response.internal_server_error(
      res,
      undefined,
      'Failed to update services!'
    )
  }
}

exports.deleteServiceById = async (req, res) => {
  try {
    const { id } = req.params

    const data = await serviceServices.deleteById(id)

    if (!data) return response.not_found(res, undefined, 'Service not found!')

    const changelog = {
      description: `Deleted service ${data}`,
      category: 'marketing',
      changedBy: req.user.id,
    }

    await changelogServices.create(changelog)

    return response.success(res, undefined, 'Successfully deleted service!')
  } catch (error) {
    console.log(error)

    return response.internal_server_error(
      res,
      undefined,
      'Failed to delete service!'
    )
  }
}
