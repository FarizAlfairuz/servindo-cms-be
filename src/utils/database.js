const { Sequelize } = require('sequelize')

const env = process.env.NODE_ENV || 'development'
const DB = require('../config/databaseConfig')[env]

const sequelize = new Sequelize(DB.name, DB.username, DB.password, {
  host: DB.host,
  dialect: DB.dialect,
  port: DB.port || 5432,
  logging: false,
})

const connectDB = async () => {
  try {
    // await sequelize.sync({force: true})
    await sequelize.sync()
    console.log('All models synchronized')
    await sequelize.authenticate()
    console.log('Database connected')
  } catch (error) {
    console.log('Unable to connect to database: ', error)
  }
}

module.exports = {
  sequelize,
  connectDB,
}
