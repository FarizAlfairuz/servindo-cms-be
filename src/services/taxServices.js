const { Op } = require('sequelize')
const { Tax, FinancialStatement, sequelize } = require('../models')
const { parseSequelizeOptions, getCursor } = require('../helpers')

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

exports.create = async (tax) => {
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
        taxId: createdTax.id,
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
  const date = new Date(updateData.date)
  const month = months[date.getMonth()]

  const dbTransaction = await sequelize.transaction()
  const options = { transaction: dbTransaction }
  try {
    const tax = await Tax.findByPk(id)

    if (!tax) return null

    const updatedTax = {
      date: updateData.date,
      description: `${month} tax payment`,
      total: updateData.total,
    }

    tax.set(updatedTax)

    await tax.save(options)

    const financial = await FinancialStatement.findOne({
      where: { taxId: tax.id },
    })

    financial.set({
      date: updateData.date,
      description: `${month} tax payment`,
      debit: updateData.total
    })

    await financial.save(options)

    await dbTransaction.commit()

    return tax
  } catch (error) {
    console.log(error)

    dbTransaction.rollback()

    throw error
  }
}

exports.deleteById = async (id) => {
  const dbTransaction = await sequelize.transaction()
  const options = { transaction: dbTransaction }

  try {
    const tax = await Tax.findByPk(id)
  
    if (!tax) return null
  
    const deletedTax = tax.description

    const financial = await FinancialStatement.findOne({
      where: { taxId: tax.id },
    })

    await financial.destroy(options)
  
    await tax.destroy(options)

    await dbTransaction.commit()
  
    return deletedTax
  } catch (error) {
    console.log(error)

    dbTransaction.rollback()

    throw error
  }

}
