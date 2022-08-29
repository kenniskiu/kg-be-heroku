'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('pertemuans', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      id: {
        type: Sequelize.STRING
      },
      mk_id: {
        type: Sequelize.STRING
      },
      pertemuan_ke: {
        type: Sequelize.INTEGER
      },
      durasi: {
        type: Sequelize.INTEGER
      },
      is_sinkronus: {
        type: Sequelize.BOOLEAN
      },
      tipe: {
        type: Sequelize.STRING
      },
      deskripsi: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('pertemuans');
  }
};