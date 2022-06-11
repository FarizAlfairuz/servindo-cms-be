const { Op } = require('sequelize')
const { sequelize } = require('../utils/database')
const customerServices = require('./customerServices')
const itemServices = require('./itemServices')
const {
  Sale,
  Item,
  Customer,
  Income,
  FinancialStatement,
} = require('../models')
const { parseSequelizeOptions, getCursor } = require('../helpers')
const generateInvoice = require('../utils/invoice')

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
    const totalPrice = items.price * items.quantity
    // after tax
    const gross = (totalPrice * (100 + items.tax)) / 100

    // sum cost of goods sold gross (base price * total buy)
    const cogsGross = itemInfo.cogs * items.quantity

    // total sales (gross - discount)
    const netSales = gross - items.discount
    // profit (total sales - total base price)
    const netProfit = netSales - cogsGross

    await itemInfo.set({
      quantity: stock,
    })
    await itemInfo.save(options)

    // generate invoice
    const invoiceData = {
      customer: customerInfo.toJSON(),
      item: {
        quantity: items.quantity,
        name: itemInfo.name,
        price: items.price,
      },
      id: sale.id,
      tax: items.tax,
      notice: 'purchases',
    }

    const invoicePath = await generateInvoice(invoiceData)

    // save sale data
    sale.set({
      totalQuantity: items.quantity,
      gross: gross,
      date: items.date,
      discount: items.discount,
      netSales,
      netProfit,
      itemId: itemInfo.id,
      customerId: customerInfo.id,
      tax: items.tax,
      invoice: invoicePath,
    })

    await sale.save(options)

    // save to income table
    await Income.create(
      {
        type: itemInfo.type,
        date: items.date,
        quantity: items.quantity,
        price: items.price,
        gross: gross,
        itemId: itemInfo.id,
        customerId: customerInfo.id,
        invoice: invoicePath,
      },
      options
    )

    // create financial statement
    await FinancialStatement.create(
      {
        date: items.date,
        description: `Sold ${itemInfo.name}`,
        type: 'sale',
        credit: gross,
        debit: 0,
      },
      options
    )

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
      [Op.or]: [
        sequelize.where(sequelize.cast(sequelize.col('Sale.date'), 'varchar'), {
          [Op.iLike]: `%${query.search}%`,
        }),
        sequelize.where(
          sequelize.cast(sequelize.col('Sale.gross'), 'varchar'),
          {
            [Op.iLike]: `%${query.search}%`,
          }
        ),
        { '$item.name$': { [Op.iLike]: `%${query.search}%` } },
        { '$customer.name$': { [Op.iLike]: `%${query.search}%` } },
      ],
    }
    options.where = where
  }

  options.order = [['date', 'DESC']]

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

exports.getBalance = async (query) => {
  const options = parseSequelizeOptions(query)

  options.order = [
    [sequelize.fn('date_trunc', 'month', sequelize.col('date')), 'ASC'],
  ]

  options.attributes = [
    [sequelize.fn('date_trunc', 'month', sequelize.col('date')), 'month'],
    [
      sequelize.cast(sequelize.fn('sum', sequelize.col('gross')), 'int'),
      'gross',
    ],
    [
      sequelize.cast(sequelize.fn('sum', sequelize.col('netSales')), 'int'),
      'netSales',
    ],
    [
      sequelize.cast(sequelize.fn('sum', sequelize.col('netProfit')), 'int'),
      'netProfit',
    ],
  ]

  options.group = [sequelize.fn('date_trunc', 'month', sequelize.col('date'))]

  options.where = sequelize.fn('EXTRACT(YEAR from "date") =', query.year)

  const balance = await Sale.findAll(options)

  return balance
}
