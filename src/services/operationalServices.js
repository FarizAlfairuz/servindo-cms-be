const { Op } = require('sequelize')
const { Operational, FinancialStatement, sequelize } = require('../models')
const { parseSequelizeOptions, getCursor } = require('../helpers')

exports.create = async (operational) => {
  const dbTransaction = await sequelize.transaction()
  const options = { transaction: dbTransaction }

  try {
    const createdOperational = await Operational.create({
    date: operational.date,
    description: operational.description,
    total: operational.total,
  }, options)


  // create financial statement
  await FinancialStatement.create(
    {
      description: operational.description,
      type: 'operational',
      credit: 0,
      debit: operational.total,
    },
    options
  )

  await dbTransaction.commit()

  return createdOperational

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
        sequelize.where(
          sequelize.cast(sequelize.col('Operational.date'), 'varchar'),
          {
            [Op.iLike]: `%${query.search}%`,
          }
        ),
      ],
    }
    options.where = where
  }

  const operational = await Operational.findAll(options)
  const cursor = await getCursor(Operational, query)

  const data = {
    edge: operational,
    cursor,
  }

  return data
}

exports.getById = async (id) => {
  const operational = await Operational.findByPk(id)

  if (!operational) return null

  return operational
}

exports.updateById = async (id, updateData) => {
  const operational = await Operational.findByPk(id)

  if (!operational) return null

  operational.set(updateData)

  await operational.save()

  return operational
}

exports.deleteById = async (id) => {
  const operational = await Operational.findByPk(id)

  if (!operational) return null

  const deletedOperational = operational.description

  await operational.destroy()

  return deletedOperational
}
