const { Op } = require('sequelize')
const { Operational, sequelize } = require('../models')
const { parseSequelizeOptions, getCursor } = require('../helpers')

exports.create = async (operational) => {
  let createdOperational = await Operational.create({
    name: operational.name,
    address: operational.address,
    cp: operational.cp,
    phone: operational.phone,
  })

  createdOperational = createdOperational.toJSON()

  return createdOperational
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
