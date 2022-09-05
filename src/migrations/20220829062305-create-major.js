'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('majors', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      name: {
        type: Sequelize.STRING
      },
      subjects_id: {
        type: Sequelize.ARRAY(Sequelize.UUID)
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('majors');
  }
};