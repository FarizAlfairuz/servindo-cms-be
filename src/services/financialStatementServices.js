const { Op } = require('sequelize')
const { sequelize } = require('../utils/database')
const { FinancialStatement } = require('../models')
const { parseSequelizeOptions, getCursor } = require('../helpers')

exports.getStatements = async (query) => {
  const options = parseSequelizeOptions(query)

  if (query.search) {
    delete options.where
    const where = {
      [Op.or]: [
        sequelize.where(
          sequelize.cast(sequelize.col('FinancialStatement.date'), 'varchar'),
          {
            [Op.iLike]: `%${query.search}%`,
          }
        ),
        sequelize.where(
          sequelize.cast(sequelize.col('FinancialStatement.type'), 'varchar'),
          {
            [Op.iLike]: `%${query.search}%`,
          }
        ),
        { description: { [Op.iLike]: `%${query.search}%` } },
      ],
    }
    options.where = where
  }
  options.order = [['date', 'DESC']]

  const statements = await FinancialStatement.findAll(options)
  const cursor = await getCursor(FinancialStatement, query)

  const data = {
    edge: statements,
    cursor,
  }

  return data
}

exports.getTotal = async (query) => {
  const options = parseSequelizeOptions(query)

  options.order = [
    [sequelize.fn('date_trunc', 'month', sequelize.col('date')), 'ASC'],
  ]

  options.attributes = [
    [sequelize.fn('date_trunc', 'month', sequelize.col('date')), 'month'],
    [
      sequelize.cast(sequelize.fn('sum', sequelize.col('debit')), 'int'),
      'debit',
    ],
    [
      sequelize.cast(sequelize.fn('sum', sequelize.col('credit')), 'int'),
      'credit',
    ],
  ]

  options.group = [sequelize.fn('date_trunc', 'month', sequelize.col('date'))]

  options.where = sequelize.fn('EXTRACT(YEAR from "date") =', query.year)

  const total = await FinancialStatement.findAll(options)

  return total
}
