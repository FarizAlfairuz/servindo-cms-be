var path = require('path')

module.exports = {
  config: path.resolve('src', 'config', 'database.config.js'),
  'migration-path': path.resolve('src', 'migrations'),
  'model-path': path.resolve('src', 'models'),
  'seeders-path': path.resolve('src', 'seeders'),
}
