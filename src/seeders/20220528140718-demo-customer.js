'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Customers', [
      {
        name: 'Customer 1',
        address: 'Bandung',
        cp: 'Eman',
        phone: '081231231',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Customer 2',
        address: 'Subang',
        cp: 'Budi',
        phone: '081231231',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Customer 3',
        address: 'Garut',
        cp: 'Asep',
        phone: '081231231',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ])
  },

  async down(queryInterface, Sequelize) {
    queryInterface.bulkDelete('Customers', null, {})
  },
}
