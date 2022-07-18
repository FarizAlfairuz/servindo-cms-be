const response = require('../utils/response')
const { financialStatementServices } = require('../services')
const path = require('path')

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

exports.downloadStatement = async (req, res) => {
  try {
    await financialStatementServices.generateStatement(req.query)

    const directoryPath = path.join(__dirname, '../../statement/')

    return res.download(directoryPath + 'statements.pdf', 'statements.pdf', (err) => {
      if (err) {
        console.log(err)
        response.internal_server_error(res, err, 'Could not download file!')
      }
    })
  } catch (error) {
    console.log(error)

    return response.internal_server_error(
      res,
      undefined,
      'Failed to download financial statements!'
    )
  }
}
