const { Op } = require('sequelize')
const { sequelize } = require('../utils/database')
const { FinancialStatement } = require('../models')
const { parseSequelizeOptions, getCursor } = require('../helpers')
const statement = require('../utils/statements')

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

exports.generateStatement = async (query) => {
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

  const sale = await FinancialStatement.findOne({
    ...options,
    where: [
      sequelize.fn('EXTRACT(YEAR from "date") =', query.year),
      sequelize.fn('EXTRACT(MONTH from "date") =', query.month),
      { type: 'sale' },
    ],
  })

  const lease = await FinancialStatement.findOne({
    ...options,
    where: [
      sequelize.fn('EXTRACT(YEAR from "date") =', query.year),
      sequelize.fn('EXTRACT(MONTH from "date") =', query.month),
      { type: 'lease' },
    ],
  })

  const service = await FinancialStatement.findOne({
    ...options,
    where: [
      sequelize.fn('EXTRACT(YEAR from "date") =', query.year),
      sequelize.fn('EXTRACT(MONTH from "date") =', query.month),
      { type: 'service' },
    ],
  })

  const purchase = await FinancialStatement.findOne({
    ...options,
    where: [
      sequelize.fn('EXTRACT(YEAR from "date") =', query.year),
      sequelize.fn('EXTRACT(MONTH from "date") =', query.month),
      { type: 'purchase' },
    ],
  })

  const tax = await FinancialStatement.findOne({
    ...options,
    where: [
      sequelize.fn('EXTRACT(YEAR from "date") =', query.year),
      sequelize.fn('EXTRACT(MONTH from "date") =', query.month),
      { type: 'tax' },
    ],
  })

  const operational = await FinancialStatement.findOne({
    ...options,
    where: [
      sequelize.fn('EXTRACT(YEAR from "date") =', query.year),
      sequelize.fn('EXTRACT(MONTH from "date") =', query.month),
      { type: 'operational' },
    ],
  })

  const otherIncome = await FinancialStatement.findOne({
    ...options,
    where: [
      sequelize.fn('EXTRACT(YEAR from "date") =', query.year),
      sequelize.fn('EXTRACT(MONTH from "date") =', query.month),
      { type: 'otherIncome' },
    ],
  })

  const months = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
  ]

  const statementData = {
    sale: sale ? sale.credit : 0,
    lease: lease ? lease.credit : 0,
    service: service ? service.credit : 0,
    purchase: purchase ? purchase.debit : 0,
    tax: tax ? tax.debit : 0,
    operational: operational ? operational.debit : 0,
    otherIncome: otherIncome ? otherIncome.credit : 0,
    month: months[query.month - 1],
    year: query.year,
  }

  await statement(statementData)

  return statementData
}
