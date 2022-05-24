const { Op } = require('sequelize')
const { Changelog, sequelize, User } = require('../models')
const { parseSequelizeOptions, getCursor } = require('../helpers')

exports.create = async (changelog) => {
  let createdChangelog = await Changelog.create({
    description: changelog.description,
    category: String(changelog.category).toLowerCase(),
    changedById: changelog.changedBy,
  })

  createdChangelog = createdChangelog.toJSON()

  return createdChangelog
}

exports.get = async (query) => {
  const options = parseSequelizeOptions(query)

  if (query.search) {
    delete options.where
    const where = {
      [Op.or]: [
        { description: { [Op.iLike]: `%${query.search}%` } },
      ],
    }
    options.where = where
  }

  options.include = { model: User, as: 'changedBy' }

  const changelog = await Changelog.findAll(options)
  const cursor = await getCursor(Changelog, query)

  const data = {
    edge: changelog,
    cursor,
  }

  return data
}
