const { Op } = require('sequelize')
const { Customer } = require('../models')
const { parseSequelizeOptions, getCursor } = require('../helpers')

exports.create = async (customer) => {
  let createdCustomer = await Customer.create({
    name: customer.name,
    address: customer.address,
    cp: customer.cp,
    phone: customer.phone,
  })

  createdCustomer = createdCustomer.toJSON()

  return createdCustomer
}

exports.get = async (query) => {
  const options = parseSequelizeOptions(query)

  if (query.search) {
    delete options.where
    const where = {
      [Op.or]: [
        { name: { [Op.iLike]: `%${query.search}%` } },
        { address: { [Op.iLike]: `%${query.search}%` } },
        { cp: { [Op.iLike]: `%${query.search}%` } },
        { phone: { [Op.iLike]: `%${query.search}%` } },
      ],
    }
    options.where = where
  }

  const customer = await Customer.findAll(options)
  const cursor = await getCursor(Customer, query)

  const data = {
    edge: customer,
    cursor,
  }

  return data
}

exports.getById = async (id) => {
  const customer = await Customer.findByPk(id)

  if (!customer) return null

  return customer
}

exports.updateById = async (id, updateData) => {
  const customer = await Customer.findByPk(id)

  if (!customer) return null

  customer.set(updateData)

  await customer.save()

  return customer
}

exports.deleteById = async (id) => {
  const customer = await Customer.findByPk(id)

  if (!customer) return null

  const deletedCustomer = customer.name

  await customer.destroy()

  return deletedCustomer
}
