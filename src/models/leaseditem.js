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
      this.belongsTo(models.Lease, { as: 'lease', foreignKey: 'leaseId' })
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
      sequelize,
      modelName: 'LeasedItem',
      initialAutoIncrement: 1000,
    }
  )
  return LeasedItem
}
