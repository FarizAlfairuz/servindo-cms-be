const { Op } = require('sequelize')
const { Item } = require('../models')
const { parseSequelizeOptions, getCursor } = require('../helpers')

exports.create = async (item) => {
  let createdItem = await Item.create({
    name: item.name,
    quantity: item.quantity,
    type: item.type,
    cogs: item.cogs,
    price: item.price,
    discount: item.discount,
  })

  return createdItem
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

  const item = await Item.findAll(options)
  const cursor = await getCursor(Item, query)

  const data = {
    edge: item,
    cursor,
  }

  return data
}

exports.getById = async (id) => {
  const item = await Item.findByPk(id)

  if (!item) return null

  return item
}

exports.updateById = async (id, updateData) => {
  const item = await Item.findByPk(id)

  if (!item) return null

  item.set(updateData)

  await item.save()

  return item
}

exports.deleteById = async (id) => {
  const item = await Item.findByPk(id)

  if (!item) return null

  const deletedItem = item.name

  await item.destroy()

  return deletedItem
}
