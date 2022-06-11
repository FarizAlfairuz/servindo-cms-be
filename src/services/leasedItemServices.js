const { Op } = require('sequelize')
const { LeasedItem, Customer } = require('../models')
const { parseSequelizeOptions, getCursor } = require('../helpers')

exports.create = async (leasedItem) => {
  let createdLeasedItem = await LeasedItem.create({
    name: leasedItem.name,
  })

  return createdLeasedItem
}

exports.get = async (query) => {
  const options = parseSequelizeOptions(query)

  if (query.search) {
    delete options.where
    const where = {
      [Op.or]: [{ name: { [Op.iLike]: `%${query.search}%` } }],
    }
    options.where = where
  }

  options.include = [
    { model: Customer, as: 'customer' },
  ]

  const leasedItem = await LeasedItem.findAll(options)
  const cursor = await getCursor(LeasedItem, query)


  const data = {
    edge: leasedItem,
    cursor,
  }

  return data
}

exports.getById = async (id) => {
  const leasedItem = await LeasedItem.findByPk(id)

  if (!leasedItem) return null

  return leasedItem
}

exports.updateById = async (id, updateData) => {
  const leasedItem = await LeasedItem.findByPk(id)

  if (!leasedItem) return null

  leasedItem.set(updateData)

  await leasedItem.save()

  return leasedItem
}

exports.deleteById = async (id) => {
  const leasedItem = await LeasedItem.findByPk(id)

  if (!leasedItem) return null

  const deletedLeasedItem = leasedItem.name

  await leasedItem.destroy()

  return deletedLeasedItem
}
