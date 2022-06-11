const { Op } = require('sequelize')
const {
  Service,
  Income,
  FinancialStatement,
  sequelize,
  Customer,
} = require('../models')
const customerServices = require('./customerServices')
const { parseSequelizeOptions, getCursor } = require('../helpers')
const generateInvoice = require('../utils/invoice')

exports.create = async (service) => {
  const dbTransaction = await sequelize.transaction()
  const options = { transaction: dbTransaction }
  try {
    const customerInfo = await customerServices.getById(service.customerId)

    const createdService = await Service.create(
      {
        description: service.description,
        date: service.date,
        price: service.price,
        customerId: customerInfo.id,
        tax: service.tax,
      },
      options
    )

    // generate invoice
    const invoiceData = {
      customer: customerInfo.toJSON(),
      item: {
        quantity: 1,
        name: service.description,
        price: service.price,
      },
      id: createdService.id,
      tax: service.tax,
      notice: 'payment',
    }

    const invoicePath = await generateInvoice(invoiceData)

    createdService.set({
      invoice: invoicePath,
    })

    await createdService.save(options)

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

  options.include = [{ model: Customer, as: 'customer' }]

  const service = await Service.findAll(options)
  const cursor = await getCursor(Service, query)

  const data = {
    edge: service,
    cursor,
  }

  return data
}

exports.getById = async (id) => {
  const service = await Service.findByPk(id, {
    include: [{ model: Customer, as: 'customer' }],
  })

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
