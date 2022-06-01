'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class LeasedItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Customer, { as: 'customer', foreignKey: 'customerId' })
    }
  }
  LeasedItem.init(
    {
      serialNumber: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      initialAutoIncrement: '1000',
      sequelize,
      modelName: 'LeasedItem',
    }
  )
  
  return LeasedItem
}
