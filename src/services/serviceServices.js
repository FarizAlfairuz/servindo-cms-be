const { Op } = require('sequelize')
const { Service, Income, FinancialStatement, sequelize } = require('../models')
const { parseSequelizeOptions, getCursor } = require('../helpers')

exports.create = async (service) => {
  const dbTransaction = await sequelize.transaction()
  const options = { transaction: dbTransaction }
  try {
    const createdService = await Service.create(
      {
        description: service.description,
        date: service.date,
        price: service.price,
        itemId: service.itemId,
        customerId: service.customerId,
      },
      options
    )

    // save to income table
    await Income.create(
      {
        type: 'service',
        date: service.date,
        quantity: 1,
        price: service.price,
        gross: service.price,
        itemId: service.itemId,
        customerId: service.customerId,
      },
      options
    )

    // create financial statement
    await FinancialStatement.create(
      {
        date: service.date,
        description: service.description,
        type: 'service',
        credit: service.price,
        debit: 0,
      },
      options
    )

    await dbTransaction.commit()

    return createdService
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
