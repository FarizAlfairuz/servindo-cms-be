const response = require('../utils/response')
const { purchaseServices, changelogServices, itemServices } = require('../services')

exports.createPurchase = async (req, res) => {
  try {
    const purchase = req.body
    if (req.file) purchase.image = req.file.path

    const data = await purchaseServices.create(purchase)

    const item = await itemServices.getById(data.itemId)

    const changelog = {
      description: `Purchased ${item.name}`,
      category: 'purchasing',
      changedBy: req.user.id,
    }

    await changelogServices.create(changelog)

    return response.created(res, data, 'Successfully purchased items!')
  } catch (error) {
    console.log(error)

    return response.internal_server_error(
      res,
      undefined,
      'Failed to create purchase data!'
    )
  }
}

exports.getPurchases = async (req, res) => {
  try {
    const data = await purchaseServices.get(req.query)

    return response.success(res, data, 'Successfully retrieved purchases!')
  } catch (error) {
    console.log(error)

    return response.internal_server_error(
      res,
      undefined,
      'Failed to retrieve purchases!'
    )
  }
}
