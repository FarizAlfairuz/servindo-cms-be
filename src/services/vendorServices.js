const { Op } = require('sequelize')
const { Vendor, sequelize } = require('../models')
const { parseSequelizeOptions, getCursor } = require('../helpers')

exports.create = async (vendor) => {
  let createdVendor = await Vendor.create({
    name: vendor.name,
    address: vendor.address,
    cp: vendor.cp,
    phone: vendor.phone,
  })

  createdVendor = createdVendor.toJSON()

  return createdVendor
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

  const vendor = await Vendor.findAll(options)
  const cursor = await getCursor(Vendor, query)

  const data = {
    edge: vendor,
    cursor,
  }

  return data
}

exports.getById = async (id) => {
  const vendor = await Vendor.findByPk(id)

  if (!vendor) return null

  return vendor
}

exports.updateById = async (id, updateData) => {
  const vendor = await Vendor.findByPk(id)

  if (!vendor) return null

  vendor.set(updateData)

  await vendor.save()

  return vendor
}

exports.deleteById = async (id) => {
  const vendor = await Vendor.findByPk(id)

  if (!vendor) return null

  const deletedVendor = vendor.vendorname

  await vendor.destroy()

  return deletedVendor
}
