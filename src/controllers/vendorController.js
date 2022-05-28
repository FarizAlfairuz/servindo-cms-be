const response = require('../utils/response')
const { vendorServices, changelogServices } = require('../services')
const { handleUniqueViolation } = require('../helpers/handleSequelizeErrors')

exports.createVendor = async (req, res) => {
  try {
    const vendor = req.body

    const data = await vendorServices.create(vendor)

    const changelog = {
      description: `Created vendor ${data.name}`,
      category: 'purchasing',
      changedBy: req.user.id
    }

    await changelogServices.create(changelog)

    return response.created(res, data, 'Successfully created vendor!')
  } catch (error) {
    console.log(error)

    if (error.name === 'SequelizeUniqueConstraintError') {
      const handledErrors = handleUniqueViolation(error)

      return response.conflict(res, handledErrors, 'Failed to create vendor!')
    }

    return response.internal_server_error(
      res,
      undefined,
      'Failed to create vendor!'
    )
  }
}

exports.getVendors = async (req, res) => {
  try {
    const data = await vendorServices.get(req.query)

    return response.success(res, data, 'Successfully retrieved vendors!')
  } catch (error) {
    console.log(error)

    return response.internal_server_error(
      res,
      undefined,
      'Failed to retrieve vendors!'
    )
  }
}

exports.getVendorById = async (req, res) => {
  try {
    const { id } = req.params

    const data = await vendorServices.getById(id)

    if (!data) return response.not_found(res, undefined, 'Vendor not found!')

    return response.success(res, data, 'Successfully retrieved vendor!')
  } catch (error) {
    console.log(error)

    return response.internal_server_error(
      res,
      undefined,
      'Failed to retrieve vendor!'
    )
  }
}

exports.updateVendorById = async (req, res) => {
  try {
    const { id } = req.params
    const updateData = req.body

    const data = await vendorServices.updateById(id, updateData)

    if (!data) return response.not_found(res, undefined, 'Vendor not found!')

    const changelog = {
      description: `Edited vendor ${data.name}`,
      category: 'purchasing',
      changedBy: req.user.id
    }

    await changelogServices.create(changelog)

    return response.success(res, data, 'Successfully updated vendor!')
  } catch (error) {
    console.log(error)

    return response.internal_server_error(
      res,
      undefined,
      'Failed to update vendors!'
    )
  }
}

exports.deleteVendorById = async (req, res) => {
  try {
    const { id } = req.params

    const data = await vendorServices.deleteById(id)

    if (!data) return response.not_found(res, undefined, 'Vendor not found!')

    const changelog = {
      description: `Deleted vendor ${data}`,
      category: 'purchasing',
      changedBy: req.user.id
    }

    await changelogServices.create(changelog)

    return response.success(res, undefined, 'Successfully deleted vendor!')
  } catch (error) {
    console.log(error)

    return response.internal_server_error(
      res,
      undefined,
      'Failed to delete vendor!'
    )
  }
}
