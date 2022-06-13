const { Op } = require('sequelize')
const { sequelize } = require('../utils/database')
const customerServices = require('./customerServices')
const itemServices = require('./itemServices')
const {
  Lease,
  Customer,
  LeasedItem,
  Income,
  FinancialStatement,
  Item,
} = require('../models')
const { parseSequelizeOptions, getCursor } = require('../helpers')
const generateInvoice = require('../utils/invoice')

exports.create = async (lease) => {
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
  const dbTransaction = await sequelize.transaction()
  const options = { transaction: dbTransaction }

  const date = new Date(lease.date)
  const month = months[date.getMonth()]

  try {
    const leaseData = await Lease.create(
      {
        paymentDate: lease.date,
        description: '',
      },
      options
    )

    const customerInfo = await customerServices.getById(lease.customerId)

    const itemInfo = await itemServices.getById(lease.itemId)

    const leasedItemInfo = await LeasedItem.findOne({
      where: { name: itemInfo.name },
    })

    // check items stock
    if (lease.quantity > itemInfo.quantity) {
      throw new Error('Insufficient item quantity!')
    }

    // sum gross
    const totalPrice = lease.price * lease.quantity
    const gross = (totalPrice + (100 * lease.tax)) / 100

    // check if items already leased
    if (leasedItemInfo === null) {
      // decrease stock
      const stock = itemInfo.quantity - lease.quantity

      await itemInfo.set({
        quantity: stock,
      })
      await itemInfo.save(options)

      // create leased items
      for (let i = 0; i < lease.quantity; i++) {
        await LeasedItem.create(
          {
            name: itemInfo.name,
            customerId: customerInfo.id,
          },
          options
        )
      }
    }

    // generate invoice
    const invoiceData = {
      customer: customerInfo.toJSON(),
      item: {
        quantity: lease.quantity,
        name: `${month} ${date.getFullYear()} lease payment for ${
          itemInfo.name
        }`,
        price: lease.price,
      },
      id: leaseData.id,
      tax: lease.tax,
      notice: 'payment',
    }

    const invoicePath = await generateInvoice(invoiceData)

    leaseData.set({
      paymentDate: lease.date,
      quantity: lease.quantity,
      price: lease.price,
      gross: gross,
      description: `${month} ${date.getFullYear()} lease payment`,
      customerId: customerInfo.id,
      itemId: itemInfo.id,
      tax: lease.tax,
      invoice: invoicePath,
    })

    await leaseData.save(options)

    // save to income table
    await Income.create(
      {
        type: 'lease',
        date: lease.date,
        quantity: lease.quantity,
        price: lease.price,
        gross: gross,
        customerId: customerInfo.id,
        itemId: itemInfo.id,
        invoice: invoicePath,
      },
      options
    )

    // create financial statement
    await FinancialStatement.create(
      {
        date: lease.date,
        description: `Leased ${itemInfo.name}`,
        type: 'lease',
        credit: gross,
        debit: 0,
      },
      options
    )

    await dbTransaction.commit()

    return leaseData
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
        sequelize.where(
          sequelize.cast(sequelize.col('Lease.paymentDate'), 'varchar'),
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

  options.order = [['paymentDate', 'DESC']]

  options.include = [
    { model: Customer, as: 'customer' },
    { model: Item, as: 'item' },
  ]

  const lease = await Lease.findAll(options)
  const cursor = await getCursor(Lease, query)

  const data = {
    edge: lease,
    cursor,
  }

  return data
}
