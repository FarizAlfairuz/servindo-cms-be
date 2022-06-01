'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Operationals', [
      {
        date: '2022-05-30',
        description: 'Employee salary',
        total: 15000000,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        date: '2022-04-30',
        description: 'Employee salary',
        total: 15000000,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        date: '2022-03-30',
        description: 'Employee salary',
        total: 15000000,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ])
  },

  async down(queryInterface, Sequelize) {
    queryInterface.bulkDelete('Operationals', null, {})
  },
}
