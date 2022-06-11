const { Op } = require('sequelize')
const { sequelize } = require('../utils/database')
const { Income, Customer, Item } = require('../models')
const { parseSequelizeOptions, getCursor } = require('../helpers')

exports.get = async (query) => {
  const options = parseSequelizeOptions(query)

  if (query.search) {
    delete options.where
    const where = {
      [Op.or]: [
        sequelize.where(
          sequelize.cast(sequelize.col('Income.date'), 'varchar'),
          {
            [Op.iLike]: `%${query.search}%`,
          }
        ),
        sequelize.where(
          sequelize.cast(sequelize.col('Income.type'), 'varchar'),
          {
            [Op.iLike]: `%${query.search}%`,
          }
        ),
        { '$item.name$': { [Op.iLike]: `%${query.search}%` } },
        { '$customer.name$': { [Op.iLike]: `%${query.search}%` } },
      ],
    }
    options.where = where
  }

  options.include = [
    { model: Customer, as: 'customer' },
    { model: Item, as: 'item' },
  ]

  const income = await Income.findAll(options)
  const cursor = await getCursor(Income, query)

  const data = {
    edge: income,
    cursor,
  }

  return data
}
