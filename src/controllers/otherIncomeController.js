const response = require('../utils/response')
const { otherIncomeServices, changelogServices } = require('../services')
const { handleUniqueViolation } = require('../helpers/handleSequelizeErrors')

exports.createOtherIncome = async (req, res) => {
  try {
    const otherIncome = req.body
    if (req.file) otherIncome.image = req.file.path

    const data = await otherIncomeServices.create(otherIncome)

    const changelog = {
      description: `Created ${data.description}`,
      category: 'finance',
      changedBy: req.user.id,
    }

    await changelogServices.create(changelog)

    return response.created(res, data, 'Successfully created other income!')
  } catch (error) {
    console.log(error)

    if (error.name === 'SequelizeUniqueConstraintError') {
      const handledErrors = handleUniqueViolation(error)

      return response.conflict(res, handledErrors, 'Failed to create other income!')
    }

    return response.internal_server_error(
      res,
      undefined,
      'Failed to create other income!'
    )
  }
}

exports.getOtherIncomes = async (req, res) => {
  try {
    const data = await otherIncomeServices.get(req.query)

    return response.success(res, data, 'Successfully retrieved other incomes!')
  } catch (error) {
    console.log(error)

    return response.internal_server_error(
      res,
      undefined,
      'Failed to retrieve other incomes!'
    )
  }
}

exports.getOtherIncomeById = async (req, res) => {
  try {
    const { id } = req.params

    const data = await otherIncomeServices.getById(id)

    if (!data) return response.not_found(res, undefined, 'Other income not found!')

    return response.success(res, data, 'Successfully retrieved other income!')
  } catch (error) {
    console.log(error)

    return response.internal_server_error(
      res,
      undefined,
      'Failed to retrieve other income!'
    )
  }
}

exports.updateOtherIncomeById = async (req, res) => {
  try {
    const { id } = req.params
    const updateData = req.body

    if (req.file) updateData.image = req.file.path

    const data = await otherIncomeServices.updateById(id, updateData)

    if (!data) return response.not_found(res, undefined, 'Other income not found!')

    const changelog = {
      description: `Edited ${data.description}`,
      category: 'finance',
      changedBy: req.user.id,
    }

    await changelogServices.create(changelog)

    return response.success(res, data, 'Successfully updated other income!')
  } catch (error) {
    console.log(error)

    return response.internal_server_error(
      res,
      undefined,
      'Failed to update other incomes!'
    )
  }
}

exports.deleteOtherIncomeById = async (req, res) => {
  try {
    const { id } = req.params

    const data = await otherIncomeServices.deleteById(id)

    if (!data) return response.not_found(res, undefined, 'Other income not found!')

    const changelog = {
      description: `Deleted ${data}`,
      category: 'finance',
      changedBy: req.user.id,
    }

    await changelogServices.create(changelog)

    return response.success(res, undefined, 'Successfully deleted other income!')
  } catch (error) {
    console.log(error)

    return response.internal_server_error(
      res,
      undefined,
      'Failed to delete other income!'
    )
  }
}
