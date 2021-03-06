'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Changelog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, { as: 'changedBy', foreignKey: 'changedById' })
    }
  }
  Changelog.init(
    {
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      category: {
        type: DataTypes.ENUM([
          'user',
          'finance',
          'marketing',
          'purchasing',
          'support',
          'item',
        ]),
        allowNull: false,
        defaultValue: 'user',
      },
    },
    {
      sequelize,
      modelName: 'Changelog',
    }
  )
  return Changelog
}
