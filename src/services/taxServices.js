const { Op } = require('sequelize')
const { Tax, sequelize } = require('../models')
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

  const date = new Date(lease.date)
  const month = months[date.getMonth()]

  let createdTax = await Tax.create({
    date: tax.date,
    description: `${month} tax payment`,
    total: tax.total,
  })

  createdTax = createdTax.toJSON()

  return createdTax
}

exports.get = async (query) => {
  const options = parseSequelizeOptions(query)

  if (query.search) {
    delete options.where
    const where = {
      [Op.or]: [
        { description: { [Op.iLike]: `%${query.search}%` } },
        sequelize.where(
          sequelize.cast(sequelize.col('Tax.date'), 'varchar'),
          {
            [Op.iLike]: `%${query.search}%`,
          }
        ),
      ],
    }
    options.where = where
  }

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
