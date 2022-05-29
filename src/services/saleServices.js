const { sequelize } = require('../utils/database')
const customerServices = require('./customerServices')
const itemServices = require('./itemServices')
const { Sale, Item, Customer } = require('../models')
const { parseSequelizeOptions, getCursor } = require('../helpers')

exports.create = async (data) => {
  const { items, customer } = data

  const dbTransaction = await sequelize.transaction()
  const options = { transaction: dbTransaction }

  try {
    const sale = await Sale.create({ date: items.date }, options)

    const customerInfo = await customerServices.getById(customer.id)

    const itemInfo = await itemServices.getById(items.id)

    // check items stock
    if (items.quantity > itemInfo.quantity) {
      throw new Error('Insufficient item quantity!')
    }

    // decrease stock
    const stock = itemInfo.quantity - items.quantity

    // sum gross
    const gross = items.price * items.quantity

    // sum cost of goods sold gross
    const cogsGross = itemInfo.cogs * items.quantity

    const netSales = gross - items.discount
    const netProfit = netSales - cogsGross

    await itemInfo.set({
      quantity: stock,
    })
    await itemInfo.save(options)

    sale.set({
      totalQuantity: items.quantity,
      gross: gross,
      date: items.date,
      discount: items.discount,
      netSales,
      netProfit,
      itemId: itemInfo.id,
      customerId: customerInfo.id,
    })

    await sale.save(options)

    await dbTransaction.commit()

    return sale
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
    { model: Customer, as: 'customer' },
  ]

  const sales = await Sale.findAll(options)
  const cursor = await getCursor(Sale, query)

  const data = {
    edge: sales,
    cursor,
  }

  return data
}
