'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Lease extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Customer, {
        as: 'customer',
        foreignKey: 'customerId',
      })
      this.belongsTo(models.Item, { as: 'item', foreignKey: 'itemId' })
    }
  }
  Lease.init(
    {
      paymentDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      gross: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      tax: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      invoice: {
        type: DataTypes.TEXT,
      },
    },
    {
      sequelize,
      modelName: 'Lease',
    }
  )
  return Lease
}
