'use strict'
const { Model } = require('sequelize')
const bcrypt = require('bcrypt')

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Changelog)
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
        defaultValue: 'superadmin',
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
          attributes: {},
        },
      },
    }
  )

  User.beforeCreate(async (user) => {
    const hashedPassword = await hashPassword(user.password)
    user.password = hashedPassword
  })

  User.beforeUpdate(async (user) => {
    if (user.password) {
      const hashedPassword = await hashPassword(user.password)
      user.password = hashedPassword
    }
  })

  return User
}
