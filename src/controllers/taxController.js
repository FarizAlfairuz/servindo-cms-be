const response = require('../utils/response')
const { taxServices, changelogServices } = require('../services')
const { handleUniqueViolation } = require('../helpers/handleSequelizeErrors')

exports.createTax = async (req, res) => {
  try {
    const tax = req.body

    const data = await taxServices.create(tax)

    const changelog = {
      description: `Created tax ${data.name}`,
      category: 'finance',
      changedBy: req.user.id,
    }

    await changelogServices.create(changelog)

    return response.created(res, data, 'Successfully created tax!')
  } catch (error) {
    console.log(error)

    if (error.name === 'SequelizeUniqueConstraintError') {
      const handledErrors = handleUniqueViolation(error)

      return response.conflict(
        res,
        handledErrors,
        'Failed to create tax!'
      )
    }

    return response.internal_server_error(
      res,
      undefined,
      'Failed to create tax!'
    )
  }
}

exports.getTaxs = async (req, res) => {
  try {
    const data = await taxServices.get(req.query)

    return response.success(res, data, 'Successfully retrieved taxs!')
  } catch (error) {
    console.log(error)

    return response.internal_server_error(
      res,
      undefined,
      'Failed to retrieve taxs!'
    )
  }
}

exports.getTaxById = async (req, res) => {
  try {
    const { id } = req.params

    const data = await taxServices.getById(id)

    if (!data)
      return response.not_found(res, undefined, 'Tax not found!')

    return response.success(res, data, 'Successfully retrieved tax!')
  } catch (error) {
    console.log(error)

    return response.internal_server_error(
      res,
      undefined,
      'Failed to retrieve tax!'
    )
  }
}

exports.updateTaxById = async (req, res) => {
  try {
    const { id } = req.params
    const updateData = req.body

    const data = await taxServices.updateById(id, updateData)

    if (!data)
      return response.not_found(res, undefined, 'Tax not found!')

    const changelog = {
      description: `Edited tax ${data.name}`,
      category: 'finance',
      changedBy: req.user.id,
    }

    await changelogServices.create(changelog)

    return response.success(res, data, 'Successfully updated tax!')
  } catch (error) {
    console.log(error)

    return response.internal_server_error(
      res,
      undefined,
      'Failed to update taxs!'
    )
  }
}

exports.deleteTaxById = async (req, res) => {
  try {
    const { id } = req.params

    const data = await taxServices.deleteById(id)

    if (!data)
      return response.not_found(res, undefined, 'Tax not found!')

    const changelog = {
      description: `Deleted tax ${data}`,
      category: 'finance',
      changedBy: req.user.id,
    }

    await changelogServices.create(changelog)

    return response.success(res, undefined, 'Successfully deleted tax!')
  } catch (error) {
    console.log(error)

    return response.internal_server_error(
      res,
      undefined,
      'Failed to delete tax!'
    )
  }
}
