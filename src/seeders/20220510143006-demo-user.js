'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Users',
      [
        {
          username: 'superadmin1',
          password: '$2a$10$1v/OSwOOcQrZQEC6m6B/1esFxmWGGjF/jpM3Tqz2Co3VW.MXbS.8u',
          role: 'superadmin',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          username: 'finance1',
          password: '$2a$10$./0b8y2XB1T4uf/WPMuUde82EEKZkAMdlXxvotpv14sSrpVNU9U.S',
          role: 'finance',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          username: 'marketing1',
          password: '$2a$10$FpveukPz.mxxBaWuBnSVNOZ.6CQ3O5hxXwNScZlpnjXAOTBxD8HdS',
          role: 'marketing',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          username: 'purchasing1',
          password: '$2a$10$2yVrj0jKWOjoW7vhiZI2De/6UyNCcZb1G3gn.ujDFooTTuBMqr536',
          role: 'purchasing',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          username: 'support1',
          password: '$2a$10$G0Yd8TE/GZyX0cWUpmq20.JuE3kLKhbYJiGGn9s92Fw0Jk8KP.PVu',
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
