'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Users',
      [
        {
          username: 'superadmin1',
          password: 'superadmin1',
          role: 'superadmin',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          username: 'finance1',
          password: 'finance1',
          role: 'finance',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          username: 'marketing1',
          password: 'marketing1',
          role: 'marketing',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          username: 'purchasing1',
          password: 'purchasing1',
          role: 'purchasing',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          username: 'support1',
          password: 'support1',
          role: 'support',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    )
  },

  async down(queryInterface, Sequelize) {
    queryInterface.bulkDelete('Users', null, {})
  },
}
