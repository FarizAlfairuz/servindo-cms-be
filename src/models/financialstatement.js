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
