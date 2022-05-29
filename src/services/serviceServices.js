const { Op } = require('sequelize')
const { Service } = require('../models')
const { parseSequelizeOptions, getCursor } = require('../helpers')

exports.create = async (service) => {
  let createdService = await Service.create({
    description: service.description,
    date: service.date,
    price: service.price,
  })

  return createdService
}

exports.get = async (query) => {
  const options = parseSequelizeOptions(query)

  if (query.search) {
    delete options.where
    const where = {
      [Op.or]: [
        { description: { [Op.iLike]: `%${query.search}%` } },
        sequelize.where(
          sequelize.cast(sequelize.col('Service.date'), 'varchar'),
          {
            [Op.iLike]: `%${query.search}%`,
          }
        ),
      ],
    }
    options.where = where
  }

  const service = await Service.findAll(options)
  const cursor = await getCursor(Service, query)

  const data = {
    edge: service,
    cursor,
  }

  return data
}

exports.getById = async (id) => {
  const service = await Service.findByPk(id)

  if (!service) return null

  return service
}

exports.updateById = async (id, updateData) => {
  const service = await Service.findByPk(id)

  if (!service) return null

  service.set(updateData)

  await service.save()

  return service
}

exports.deleteById = async (id) => {
  const service = await Service.findByPk(id)

  if (!service) return null

  const deletedService = service.description

  await service.destroy()

  return deletedService
}
