const response = require('../utils/response')
const { leaseServices, changelogServices } = require('../services')

exports.createLease = async (req, res) => {
  try {
    const lease = req.body
    if (req.file) lease.image = req.file.path

    const data = await leaseServices.create(lease)

    const changelog = {
      description: `Added ${data.description}`,
      category: 'marketing',
      changedBy: req.user.id,
    }

    await changelogServices.create(changelog)

    return response.created(res, data, 'Successfully leased items!')
  } catch (error) {
    console.log(error)

    return response.internal_server_error(
      res,
      undefined,
      'Failed to create lease data!'
    )
  }
}

exports.getLeases = async (req, res) => {
  try {
    const data = await leaseServices.get(req.query)

    return response.success(res, data, 'Successfully retrieved lease data!')
  } catch (error) {
    console.log(error)

    return response.internal_server_error(
      res,
      undefined,
      'Failed to retrieve lease data!'
    )
  }
}
