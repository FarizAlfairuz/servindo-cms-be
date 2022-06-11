const { Op } = require('sequelize')
const { Tax, FinancialStatement, sequelize } = require('../models')
const { parseSequelizeOptions, getCursor } = require('../helpers')

exports.create = async (tax) => {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]

  const date = new Date(tax.date)
  const month = months[date.getMonth()]

  const dbTransaction = await sequelize.transaction()
  const options = { transaction: dbTransaction }

  try {
    const createdTax = await Tax.create(
      {
        date: tax.date,
        description: `${month} tax payment`,
        total: tax.total,
      },
      options
    )

    // create financial statement
    await FinancialStatement.create(
      {
        date: tax.date,
        description: `${month} tax payment`,
        type: 'tax',
        credit: 0,
        debit: tax.total,
      },
      options
    )

    await dbTransaction.commit()

    return createdTax
  } catch (error) {
    console.log(error)

    dbTransaction.rollback()

    throw error
  }
}

exports.get = async (query) => {
  const options = parseSequelizeOptions(query)

  if (query.search) {
    delete options.where
    const where = {
      [Op.or]: [
        { description: { [Op.iLike]: `%${query.search}%` } },
        sequelize.where(sequelize.cast(sequelize.col('Tax.date'), 'varchar'), {
          [Op.iLike]: `%${query.search}%`,
        }),
      ],
    }
    options.where = where
  }

  options.order = [['date', 'DESC']]

  const tax = await Tax.findAll(options)
  const cursor = await getCursor(Tax, query)

  const data = {
    edge: tax,
    cursor,
  }

  return data
}

exports.getById = async (id) => {
  const tax = await Tax.findByPk(id)

  if (!tax) return null

  return tax
}

exports.updateById = async (id, updateData) => {
  const tax = await Tax.findByPk(id)

  if (!tax) return null

  tax.set(updateData)

  await tax.save()

  return tax
}

exports.deleteById = async (id) => {
  const tax = await Tax.findByPk(id)

  if (!tax) return null

  const deletedTax = tax.description

  await tax.destroy()

  return deletedTax
}
