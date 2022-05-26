'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Vendors', [
      {
        name: 'Vendor 1',
        address: 'Jakarta',
        cp: 'Agus',
        phone: '081231231',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Vendor 2',
        address: 'Bandung',
        cp: 'Maman',
        phone: '081231231',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Vendor 3',
        address: 'Sumedang',
        cp: 'Dedi',
        phone: '081231231',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ])
  },

  async down(queryInterface, Sequelize) {
    queryInterface.bulkDelete('Vendors', null, {})
  },
}
