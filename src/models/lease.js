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
      this.hasMany(models.LeasedItem, { as: 'lease', foreignKey: 'leaseId' })
      this.belongsTo(models.Customer, {
        as: 'customer',
        foreignKey: 'customerId',
      })
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
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: 'Lease',
    }
  )
  return Lease
}