const response = require('../utils/response')
const { operationalServices, changelogServices } = require('../services')
const { handleUniqueViolation } = require('../helpers/handleSequelizeErrors')

exports.createOperational = async (req, res) => {
  try {
    const operational = req.body

    const data = await operationalServices.create(operational)

    const changelog = {
      description: `Created operational ${data.name}`,
      category: 'finance',
      changedBy: req.user.id
    }

    await changelogServices.create(changelog)

    return response.created(res, data, 'Successfully created operational!')
  } catch (error) {
    console.log(error)

    if (error.name === 'SequelizeUniqueConstraintError') {
      const handledErrors = handleUniqueViolation(error)

      return response.conflict(res, handledErrors, 'Failed to create operational!')
    }

    return response.internal_server_error(
      res,
      undefined,
      'Failed to create operational!'
    )
  }
}

exports.getOperationals = async (req, res) => {
  try {
    const data = await operationalServices.get(req.query)

    return response.success(res, data, 'Successfully retrieved operationals!')
  } catch (error) {
    console.log(error)

    return response.internal_server_error(
      res,
      undefined,
      'Failed to retrieve operationals!'
    )
  }
}

exports.getOperationalById = async (req, res) => {
  try {
    const { id } = req.params

    const data = await operationalServices.getById(id)

    if (!data) return response.not_found(res, undefined, 'Operational not found!')

    return response.success(res, data, 'Successfully retrieved operational!')
  } catch (error) {
    console.log(error)

    return response.internal_server_error(
      res,
      undefined,
      'Failed to retrieve operational!'
    )
  }
}

exports.updateOperationalById = async (req, res) => {
  try {
    const { id } = req.params
    const updateData = req.body

    const data = await operationalServices.updateById(id, updateData)

    if (!data) return response.not_found(res, undefined, 'Operational not found!')

    const changelog = {
      description: `Edited operational ${data.name}`,
      category: 'finance',
      changedBy: req.user.id
    }

    await changelogServices.create(changelog)

    return response.success(res, data, 'Successfully updated operational!')
  } catch (error) {
    console.log(error)

    return response.internal_server_error(
      res,
      undefined,
      'Failed to update operationals!'
    )
  }
}

exports.deleteOperationalById = async (req, res) => {
  try {
    const { id } = req.params

    const data = await operationalServices.deleteById(id)

    if (!data) return response.not_found(res, undefined, 'Operational not found!')

    const changelog = {
      description: `Deleted operational ${data}`,
      category: 'finance',
      changedBy: req.user.id
    }

    await changelogServices.create(changelog)

    return response.success(res, undefined, 'Successfully deleted operational!')
  } catch (error) {
    console.log(error)

    return response.internal_server_error(
      res,
      undefined,
      'Failed to delete operational!'
    )
  }
}
