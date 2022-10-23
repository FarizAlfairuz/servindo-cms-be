const { Op } = require('sequelize')
const { Operational, FinancialStatement, sequelize } = require('../models')
const { parseSequelizeOptions, getCursor } = require('../helpers')
const { deleteCloudPicture } = require('../utils/cloudinary')

exports.create = async (operational) => {
  const dbTransaction = await sequelize.transaction()
  const options = { transaction: dbTransaction }

  try {
    const createdOperational = await Operational.create(
      {
        date: operational.date,
        description: operational.description,
        total: operational.total,
        image: operational.image,
      },
      options
    )

    // create financial statement
    await FinancialStatement.create(
      {
        date: operational.date,
        description: operational.description,
        type: 'operational',
        credit: 0,
        debit: operational.total,
        operationalId: createdOperational.id,
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

  options.order = [['date', 'DESC']]

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
  const dbTransaction = await sequelize.transaction()
  const options = { transaction: dbTransaction }

  try {
    const operational = await Operational.findByPk(id)

    if (!operational) return null

    if (operational.image) deleteCloudPicture(operational.image)

    operational.set(updateData)

    await operational.save(options)

    const financial = await FinancialStatement.findOne({
      where: { operationalId: operational.id },
    })

    const updatedFinancial = {
      date: updateData.date ? updateData.date : financial.date,
      description: updateData.description
        ? updateData.description
        : financial.description,
      debit: updateData.total ? updateData.total : financial.debit,
    }

    financial.set(updatedFinancial)

    await financial.save(options)

    await dbTransaction.commit()

    return operational
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
    const operational = await Operational.findByPk(id)

    if (!operational) return null

    if (operational.image) deleteCloudPicture(operational.image)

    const deletedOperational = operational.description

    const financial = await FinancialStatement.findOne({
      where: { operationalId: operational.id },
    })

    await financial.destroy(options)

    await operational.destroy(options)

    await dbTransaction.commit()

    return deletedOperational
  } catch (error) {
    console.log(error)

    dbTransaction.rollback()

    throw error
  }
}
