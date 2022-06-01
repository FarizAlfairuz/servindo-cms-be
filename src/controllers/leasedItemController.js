const response = require('../utils/response')
const { leasedItemServices } = require('../services')

exports.getLeasedItems = async (req, res) => {
    try {
      const data = await leasedItemServices.get(req.query)
  
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