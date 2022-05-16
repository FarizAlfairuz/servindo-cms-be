const { Op } = require('sequelize')

module.exports = (query) => {
  const options = {}

  if (query) {
    const filter = JSON.parse(JSON.stringify(query))

    if (query.limit) {
      if (query.page) {
        options.offset = parseInt(query.limit, 10) * parseInt(query.page - 1, 10)
        delete filter.page
      }

      options.limit = parseInt(query.limit, 10)
      delete filter.limit
    }


    if (filter) {
      const whereObj = {}

      Object.keys(filter).forEach((field) => {
        const fieldValue = filter[field]
        whereObj[field] = { [Op.like]: `%${fieldValue}%` }
      })
      options.where = whereObj
    }
  }

  return options
}
