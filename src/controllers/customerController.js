const response = require('../utils/response')
const { customerServices, changelogServices } = require('../services')
const { handleUniqueViolation } = require('../helpers/handleSequelizeErrors')

exports.createCustomer = async (req, res) => {
  try {
    const customer = req.body

    const data = await customerServices.create(customer)

    const changelog = {
      description: `Created customer ${data.name}`,
      category: 'purchasing',
      changedBy: req.user.id
    }

    await changelogServices.create(changelog)

    return response.created(res, data, 'Successfully created customer!')
  } catch (error) {
    console.log(error)

    if (error.name === 'SequelizeUniqueConstraintError') {
      const handledErrors = handleUniqueViolation(error)

      return response.conflict(res, handledErrors, 'Failed to create customer!')
    }

    return response.internal_server_error(
      res,
      undefined,
      'Failed to create customer!'
    )
  }
}

exports.getCustomers = async (req, res) => {
  try {
    const data = await customerServices.get(req.query)

    return response.success(res, data, 'Successfully retrieved customers!')
  } catch (error) {
    console.log(error)

    return response.internal_server_error(
      res,
      undefined,
      'Failed to retrieve customers!'
    )
  }
}

exports.getCustomerById = async (req, res) => {
  try {
    const { id } = req.params

    const data = await customerServices.getById(id)

    if (!data) return response.not_found(res, undefined, 'Customer not found!')

    return response.success(res, data, 'Successfully retrieved customer!')
  } catch (error) {
    console.log(error)

    return response.internal_server_error(
      res,
      undefined,
      'Failed to retrieve customer!'
    )
  }
}

exports.updateCustomerById = async (req, res) => {
  try {
    const { id } = req.params
    const updateData = req.body

    const data = await customerServices.updateById(id, updateData)

    if (!data) return response.not_found(res, undefined, 'Customer not found!')

    const changelog = {
      description: `Edited customer ${data.name}`,
      category: 'marketing',
      changedBy: req.user.id
    }

    await changelogServices.create(changelog)

    return response.success(res, data, 'Successfully updated customer!')
  } catch (error) {
    console.log(error)

    return response.internal_server_error(
      res,
      undefined,
      'Failed to update customers!'
    )
  }
}

exports.deleteCustomerById = async (req, res) => {
  try {
    const { id } = req.params

    const data = await customerServices.deleteById(id)

    if (!data) return response.not_found(res, undefined, 'Customer not found!')

    const changelog = {
      description: `Deleted customer ${data}`,
      category: 'marketing',
      changedBy: req.user.id
    }

    await changelogServices.create(changelog)

    return response.success(res, undefined, 'Successfully deleted customer!')
  } catch (error) {
    console.log(error)

    return response.internal_server_error(
      res,
      undefined,
      'Failed to delete customer!'
    )
  }
}
