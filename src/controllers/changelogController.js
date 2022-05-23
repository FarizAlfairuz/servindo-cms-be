const response = require('../utils/response')
const { changelogServices } = require('../services')

exports.getChangelogs = async (req, res) => {
  try {
    const data = await changelogServices.get(req.query)

    return response.success(res, data, 'Successfully retrieved changelog data!')
  } catch (error) {
    console.log(error)

    return response.internal_server_error(
      res,
      undefined,
      'Failed to retrieve changelog data!'
    )
  }
}
