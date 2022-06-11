const response = require('../utils/response')
const { financialStatementServices } = require('../services')

exports.getStatements = async (req, res) => {
  try {
    const data = await financialStatementServices.getStatements(req.query)

    return response.success(
      res,
      data,
      'Successfully retrieved financial statements!'
    )
  } catch (error) {
    console.log(error)

    return response.internal_server_error(
      res,
      undefined,
      'Failed to retrieve financial statements!'
    )
  }
}

exports.getTotal = async (req, res) => {
  try {
    const data = await financialStatementServices.getTotal(req.query)

    return response.success(
      res,
      data,
      'Successfully retrieved financial statements total value!'
    )
  } catch (error) {
    console.log(error)

    return response.internal_server_error(
      res,
      undefined,
      'Failed to retrieve financial statements total value!'
    )
  }
}
