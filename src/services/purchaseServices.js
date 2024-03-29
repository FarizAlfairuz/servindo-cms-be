const { Op } = require('sequelize')
const { sequelize } = require('../utils/database')
const vendorServices = require('./vendorServices')
const { Purchase, Item, Vendor, FinancialStatement } = require('../models')
const { parseSequelizeOptions, getCursor } = require('../helpers')

exports.create = async (items) => {
  const dbTransaction = await sequelize.transaction()
  const options = { transaction: dbTransaction }

  try {
    const purchase = await Purchase.create(
      { date: items.date, image: items.image },
      options
    )

    const vendorInfo = await vendorServices.getById(items.vendorId)

    // exclude date from items
    const { date, vendorId, image, ...newItem } = items

    // markup price
    const markup = 25 / 100

    const cogs = parseInt(items.cogs, 10)

    // process items
    const price = cogs + (cogs * markup)

    const [itemInfo, created] = await Item.findOrCreate({
      ...options,
      ...{
        where: { name: items.name },
        defaults: {
          ...newItem,
          price,
        },
      },
    })

    // increase stock
    let stock

    if (created) {
      stock = items.quantity
    } else {
      stock = itemInfo.quantity + items.quantity
    }

    // sum gross
    const gross = cogs * items.quantity

    await itemInfo.set({
      quantity: stock,
      cogs: cogs,
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

    // create financial statement
    await FinancialStatement.create(
      {
        date: items.date,
        description: `Purchased ${itemInfo.name}`,
        type: 'purchase',
        credit: 0,
        debit: gross,
        purchaseId: purchase.id,
      },
      options
    )

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
      [Op.or]: [
        sequelize.where(
          sequelize.cast(sequelize.col('Purchase.date'), 'varchar'),
          {
            [Op.iLike]: `%${query.search}%`,
          }
        ),
        sequelize.where(
          sequelize.cast(sequelize.col('Purchase.gross'), 'varchar'),
          {
            [Op.iLike]: `%${query.search}%`,
          }
        ),
        { '$item.name$': { [Op.iLike]: `%${query.search}%` } },
        { '$vendor.name$': { [Op.iLike]: `%${query.search}%` } },
      ],
    }
    options.where = where
  }

  options.order = [['date', 'DESC']]

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
