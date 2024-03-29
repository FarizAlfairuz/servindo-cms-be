const { Op } = require('sequelize')
const { OtherIncome, FinancialStatement, sequelize } = require('../models')
const { parseSequelizeOptions, getCursor } = require('../helpers')
const { deleteCloudPicture } = require('../utils/cloudinary')

exports.create = async (otherIncome) => {
  const dbTransaction = await sequelize.transaction()
  const options = { transaction: dbTransaction }

  try {
    const createdOtherIncome = await OtherIncome.create(
      {
        date: otherIncome.date,
        description: otherIncome.description,
        total: otherIncome.total,
        image: otherIncome.image,
      },
      options
    )

    // create financial statement
    await FinancialStatement.create(
      {
        date: otherIncome.date,
        description: otherIncome.description,
        type: 'otherIncome',
        credit: otherIncome.total,
        debit: 0,
        otherIncomeId: createdOtherIncome.id
      },
      options
    )
    await dbTransaction.commit()

    return createdOtherIncome
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
      [Op.or]: [{ description: { [Op.iLike]: `%${query.search}%` } }],
    }
    options.where = where
  }

  options.order = [['date', 'DESC']]

  const otherIncome = await OtherIncome.findAll(options)
  const cursor = await getCursor(OtherIncome, query)

  const data = {
    edge: otherIncome,
    cursor,
  }

  return data
}

exports.getById = async (id) => {
  const otherIncome = await OtherIncome.findByPk(id)

  if (!otherIncome) return null

  return otherIncome
}

exports.updateById = async (id, updateData) => {
  const otherIncome = await OtherIncome.findByPk(id)

  if (!otherIncome) return null

  if (otherIncome.image) deleteCloudPicture(otherIncome.image)

  otherIncome.set(updateData)

  await otherIncome.save()

  return otherIncome
}

exports.deleteById = async (id) => {
  const otherIncome = await OtherIncome.findByPk(id)

  if (!otherIncome) return null

  if (otherIncome.image) deleteCloudPicture(otherIncome.image)

  const deletedOtherIncome = otherIncome.description

  await otherIncome.destroy()

  return deletedOtherIncome
}
