const { sequelize } = require('../utils/database')
const vendorServices = require('./vendorServices')
const { Purchase, Item, Vendor } = require('../models')
const { parseSequelizeOptions, getCursor } = require('../helpers')

exports.create = async (data) => {
  const { items, vendor } = data

  const dbTransaction = await sequelize.transaction()
  const options = { transaction: dbTransaction }

  try {
    const purchase = await Purchase.create({ date: items.date }, options)

    const vendorInfo = await vendorServices.getById(vendor.id)

    // markup price
    const markup = 25 / 100

    // process items
    const price = items.cogs + items.cogs * markup

    const [itemInfo] = await Item.findOrCreate({
      ...options,
      ...{
        where: { name: items.name },
        defaults: {
          ...items,
          price,
        },
      },
    })

    // increase stock
    const stock = itemInfo.quantity + items.quantity

    // sum gross
    const gross = items.cogs * items.quantity

    await itemInfo.set({
      quantity: stock,
      cogs: items.cogs,
    })

    await itemInfo.save(options)

    purchase.set({
      totalQuantity: items.quantity,
      gross: gross,
      date: items.date,
      itemId: itemInfo.id,
      vendorId: vendorInfo.id,
    })

    await purchase.save(options)

    await dbTransaction.commit()

    return purchase
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
      [Op.or]: [{ description: { [Op.iLike]: `%${query.search}%` } }],
    }
    options.where = where
  }

  options.include = [
    { model: Item, as: 'item' },
    { model: Vendor, as: 'vendor' },
  ]

  const purchases = await Purchase.findAll(options)
  const cursor = await getCursor(Purchase, query)

  const data = {
    edge: purchases,
    cursor,
  }

  return data
}
