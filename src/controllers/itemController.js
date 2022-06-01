const response = require('../utils/response')
const { itemServices, changelogServices } = require('../services')
const { handleUniqueViolation } = require('../helpers/handleSequelizeErrors')

exports.createItem = async (req, res) => {
  try {
    const item = req.body

    const data = await itemServices.create(item)

    const changelog = {
      description: `Created item ${data.name}`,
      category: 'item',
      changedBy: req.user.id,
    }

    await changelogServices.create(changelog)

    return response.created(res, data, 'Successfully created item!')
  } catch (error) {
    console.log(error)

    if (error.name === 'SequelizeUniqueConstraintError') {
      const handledErrors = handleUniqueViolation(error)

      return response.conflict(res, handledErrors, 'Failed to create item!')
    }

    return response.internal_server_error(
      res,
      undefined,
      'Failed to create item!'
    )
  }
}

exports.getItems = async (req, res) => {
  try {
    const data = await itemServices.get(req.query)

    return response.success(res, data, 'Successfully retrieved items!')
  } catch (error) {
    console.log(error)

    return response.internal_server_error(
      res,
      undefined,
      'Failed to retrieve items!'
    )
  }
}

exports.getItemById = async (req, res) => {
  try {
    const { id } = req.params

    const data = await itemServices.getById(id)

    if (!data) return response.not_found(res, undefined, 'Item not found!')

    return response.success(res, data, 'Successfully retrieved item!')
  } catch (error) {
    console.log(error)

    return response.internal_server_error(
      res,
      undefined,
      'Failed to retrieve item!'
    )
  }
}

exports.updateItemById = async (req, res) => {
  try {
    const { id } = req.params
    const updateData = req.body

    const data = await itemServices.updateById(id, updateData)

    if (!data) return response.not_found(res, undefined, 'Item not found!')

    const changelog = {
      description: `Edited item ${data.name}`,
      category: 'item',
      changedBy: req.user.id,
    }

    await changelogServices.create(changelog)

    return response.success(res, data, 'Successfully updated item!')
  } catch (error) {
    console.log(error)

    return response.internal_server_error(
      res,
      undefined,
      'Failed to update items!'
    )
  }
}

exports.deleteItemById = async (req, res) => {
  try {
    const { id } = req.params

    const data = await itemServices.deleteById(id)

    if (!data) return response.not_found(res, undefined, 'Item not found!')

    const changelog = {
      description: `Deleted item ${data}`,
      category: 'item',
      changedBy: req.user.id,
    }

    await changelogServices.create(changelog)

    return response.success(res, undefined, 'Successfully deleted item!')
  } catch (error) {
    console.log(error)

    return response.internal_server_error(
      res,
      undefined,
      'Failed to delete item!'
    )
  }
}
