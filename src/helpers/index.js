/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
const fs = require('fs')
const path = require('path')

const basename = path.basename(__filename)

const helpers = {}

fs.readdirSync(__dirname)
  .filter(
    (file) =>
      file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
  )
  .forEach((file) => {
    const helper = require(path.join(__dirname, file))
    const helperName = file.slice(0, -3)

    helpers[helperName] = helper
  })

module.exports = helpers
