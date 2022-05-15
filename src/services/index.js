const fs = require('fs')
const path = require('path')

const basename = path.basename(__filename)

const services = {}

fs.readdirSync(__dirname)
  .filter(
    (file) =>
      file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
  )
  .forEach((file) => {
    const service = require(path.join(__dirname, file))
    const serviceName = file.slice(0, -3)

    services[serviceName] = service
  })

module.exports = services
