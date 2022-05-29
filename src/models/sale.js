'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Sale extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Item, { as: 'item', foreignKey: 'itemId' })
      this.belongsTo(models.Customer, { as: 'customer', foreignKey: 'customerId' })
    }
  }
  Sale.init(
    {
      totalQuantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      gross: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      discount: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      netSales: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      netProfit: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: 'Sale',
    }
  )
  return Sale
}
