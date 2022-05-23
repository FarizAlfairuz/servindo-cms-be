'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Categories', [
      {
        name: 'Epson LQ20',
        stock: 10,
        base_price: 2000000,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Epson LQ21',
        stock: 10,
        base_price: 2100000,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Epson LQ22',
        stock: 10,
        base_price: 2200000,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Epson LQ23',
        stock: 10,
        base_price: 2300000,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ])
  },

  async down(queryInterface, Sequelize) {
    queryInterface.bulkDelete('Categories', null, {})
  },
}
