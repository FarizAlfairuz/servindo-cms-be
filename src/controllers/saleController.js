const response = require('../utils/response')
const { saleServices, changelogServices, itemServices } = require('../services')

exports.createSale = async (req, res) => {
  try {
    const data = await saleServices.create(req.body)

    const item = await itemServices.getById(data.itemId)

    const changelog = {
      description: `Sold item ${item.name}`,
      category: 'marketing',
      changedBy: req.user.id,
    }

    await changelogServices.create(changelog)

    return response.created(res, data, 'Successfully sold items!')
  } catch (error) {
    console.log(error)

    return response.internal_server_error(
      res,
      undefined,
      'Failed to create sale data!'
    )
  }
}

exports.getSales = async (req, res) => {
  try {
    const data = await saleServices.get(req.query)

    return response.success(res, data, 'Successfully retrieved sales!')
  } catch (error) {
    console.log(error)

    return response.internal_server_error(
      res,
      undefined,
      'Failed to retrieve sales!'
    )
  }
}
