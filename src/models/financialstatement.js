'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class FinancialStatement extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Lease, {as: 'lease', foreignKey: 'leaseId'})
      this.belongsTo(models.Operational, {as: 'operational', foreignKey: 'operationalId'})
      this.belongsTo(models.OtherIncome, {as: 'otherIncome', foreignKey: 'otherIncomeId'})
      this.belongsTo(models.Purchase, {as: 'purchase', foreignKey: 'purchaseId'})
      this.belongsTo(models.Sale, {as: 'sale', foreignKey: 'saleId'})
      this.belongsTo(models.Service, {as: 'service', foreignKey: 'serviceId'})
      this.belongsTo(models.Tax, {as: 'tax', foreignKey: 'taxId'})
    }
  }
  FinancialStatement.init(
    {
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM([
          'lease',
          'purchase',
          'sale',
          'tax',
          'operational',
          'otherIncome',
          'service',
        ]),
        allowNull: false,
      },
      debit: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      credit: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: 'FinancialStatement',
    }
  )

  FinancialStatement.beforeCreate((statement) => {
    const negateDebit = statement.debit * -1
    statement.debit = negateDebit
  })

  FinancialStatement.beforeUpdate((statement) => {
    if (statement.debit) {
      const negateDebit = statement.debit * -1
      statement.debit = negateDebit
    }
  })

  return FinancialStatement
}
