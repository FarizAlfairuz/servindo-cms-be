const response = require('../utils/response')
const { incomeServices } = require('../services')

exports.getIncomes = async (req, res) => {
  try {
    const data = await incomeServices.get(req.query)

    return response.success(res, data, 'Successfully retrieved incomes!')
  } catch (error) {
    console.log(error)

    return response.internal_server_error(
      res,
      undefined,
      'Failed to retrieve incomes!'
    )
  }
}
