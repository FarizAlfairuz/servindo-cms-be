'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init(
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM([
          'superadmin',
          'finance',
          'marketing',
          'purchasing',
          'support',
        ]),
        allowNull: false,
        defpassword: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
    },
    {
      sequelize,
      modelName: 'User',
      defaultScope: {
        // default scopenya apa
        attributes: { exclude: ['password'] },
      },
      scopes: {
        // plan untuk query kedepannya
        withPassword: {
          // misal
          attributes: { include: ['password'] },
        },
      },
    }
  )
  return User
}
