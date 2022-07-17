'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Income extends Model {
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
  Income.init(
    {
      type: {
        type: DataTypes.ENUM(['unit', 'supplies', 'lease', 'service']),
        allowNull: false,
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      gross: {
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
      modelName: 'Income',
    }
  )
  return Income
}
