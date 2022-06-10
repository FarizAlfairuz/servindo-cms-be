'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Sales', [
      {
        date: '2021-01-01',
        totalQuantity: 20,
        gross: 20000000,
        discount: 0,
        netSales: 20000000,
        netProfit: 20000000,
        itemId: '1',
        customerId: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        date: '2021-02-01',
        totalQuantity: 21,
        gross: 21000000,
        discount: 0,
        netSales: 21000000,
        netProfit: 21000000,
        itemId: '1',
        customerId: '2',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        date: '2021-03-01',
        totalQuantity: 20,
        gross: 20000000,
        discount: 0,
        netSales: 20000000,
        netProfit: 20000000,
        itemId: '1',
        customerId: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        date: '2021-04-01',
        totalQuantity: 30,
        gross: 30000000,
        discount: 0,
        netSales: 30000000,
        netProfit: 30000000,
        itemId: '2',
        customerId: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        date: '2021-05-01',
        totalQuantity: 23,
        gross: 23000000,
        discount: 0,
        netSales: 23000000,
        netProfit: 23000000,
        itemId: '1',
        customerId: '3',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        date: '2021-06-01',
        totalQuantity: 20,
        gross: 20000000,
        discount: 0,
        netSales: 20000000,
        netProfit: 20000000,
        itemId: '1',
        customerId: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        date: '2021-07-01',
        totalQuantity: 24,
        gross: 24000000,
        discount: 0,
        netSales: 24000000,
        netProfit: 24000000,
        itemId: '1',
        customerId: '2',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        date: '2021-08-01',
        totalQuantity: 19,
        gross: 19000000,
        discount: 0,
        netSales: 19000000,
        netProfit: 19000000,
        itemId: '1',
        customerId: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        date: '2021-09-01',
        totalQuantity: 25,
        gross: 25000000,
        discount: 0,
        netSales: 25000000,
        netProfit: 25000000,
        itemId: '1',
        customerId: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        date: '2021-10-01',
        totalQuantity: 22,
        gross: 22000000,
        discount: 0,
        netSales: 22000000,
        netProfit: 22000000,
        itemId: '1',
        customerId: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        date: '2021-11-01',
        totalQuantity: 28,
        gross: 28000000,
        discount: 0,
        netSales: 28000000,
        netProfit: 28000000,
        itemId: '1',
        customerId: '2',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        date: '2021-12-01',
        totalQuantity: 32,
        gross: 32000000,
        discount: 0,
        netSales: 32000000,
        netProfit: 32000000,
        itemId: '1',
        customerId: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    queryInterface.bulkDelete('Sales', null, {})
  }
};
