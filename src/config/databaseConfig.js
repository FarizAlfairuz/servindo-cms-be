require('dotenv').config()

module.exports = {
  development: {
    name: process.env.DB_NAME,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
  },
  production: {
    username: 'root',
    password: null,
    database: 'db_prod',
    host: '127.0.0.1',
    dialect: 'postgres',
  }
}
