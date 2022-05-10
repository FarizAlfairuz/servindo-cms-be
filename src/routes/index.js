const fs = require('fs')
const path = require('path')

const basename = path.basename(__filename)

const routes = {}

fs.readdirSync(__dirname)
  .filter(
    (file) =>
      file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
  )
  .forEach((file) => {
    const route = require(path.join(__dirname, file))
    const routeName = file.slice(0, -3)

    routes[routeName] = route
  })

module.exports = routes
