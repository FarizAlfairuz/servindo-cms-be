const { Op } = require('sequelize')
const { User, sequelize } = require('../models')
const { parseSequelizeOptions, getCursor } = require('../helpers')

exports.create = async (user) => {
  let createdUser = await User.create({
    id: user.id,
    username: user.username,
    password: user.password,
    role: String(user.role).toLowerCase(),
  })

  createdUser = createdUser.toJSON()
  delete createdUser.password

  return createdUser
}

exports.get = async (query) => {
  const options = parseSequelizeOptions(query)

  if (query.search) {
    delete options.where
    const where = {
      [Op.or]: [
        { username: { [Op.iLike]: `%${query.search}%` } },

        sequelize.where(sequelize.cast(sequelize.col('User.role'), 'varchar'), {
          [Op.iLike]: `%${query.search}%`,
        }),
      ],
    }
    options.where = where
  }

  const user = await User.findAll(options)
  const cursor = await getCursor(User, query)

  const data = {
    edge: user,
    cursor,
  }

  return data
}

exports.getById = async (id) => {
  const user = await User.findByPk(id)

  if (!user) return null

  return user
}

exports.updateById = async (id, updateData) => {
  const user = await User.findByPk(id)

  if (!user) return null

  user.set(updateData)

  await user.save()

  return user
}

exports.deleteById = async (id) => {
  const user = await User.findByPk(id)

  if (!user) return null

  const deletedUser = user.username

  await user.destroy()

  return deletedUser
}
