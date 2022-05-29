'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Items', [
      {
        name: 'Epson LQ20',
        quantity: 10,
        cogs: 1750000,
        price: 3000000,
        discount: 0,
        type: "unit",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Epson LQ21',
        quantity: 10,
        cogs: 1750000,
        price: 3000000,
        discount: 0,
        type: "unit",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    queryInterface.bulkDelete('Items', null, {})
  }
};
