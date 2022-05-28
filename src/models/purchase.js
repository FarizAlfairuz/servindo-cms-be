'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Purchase extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Item, { foreignKey: 'itemId' })
      this.belongsTo(models.Vendor, { foreignKey: 'vendorId' })
    }
  }
  Purchase.init(
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
    },
    {
      sequelize,
      modelName: 'Purchase',
    }
  )
  return Purchase
}
