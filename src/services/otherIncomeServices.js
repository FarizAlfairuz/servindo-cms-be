const { Op } = require('sequelize')
const { OtherIncome } = require('../models')
const { parseSequelizeOptions, getCursor } = require('../helpers')

exports.create = async (otherIncome) => {
  let createdOtherIncome = await OtherIncome.create({
    date: otherIncome.date,
    description: otherIncome.description,
    total: otherIncome.total,
  })

  return createdOtherIncome
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

  otherIncome.set(updateData)

  await otherIncome.save()

  return otherIncome
}

exports.deleteById = async (id) => {
  const otherIncome = await OtherIncome.findByPk(id)

  if (!otherIncome) return null

  const deletedOtherIncome = otherIncome.description

  await otherIncome.destroy()

  return deletedOtherIncome
}
