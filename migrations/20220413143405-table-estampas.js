'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('estampas',
      {
        idEstampa: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          allowNull: false,
          primaryKey: true,
        },
        tema: Sequelize.STRING,
        descricao: Sequelize.STRING,
        img_fieldname: Sequelize.STRING,
        img_destination: Sequelize.STRING,
        img_filename: Sequelize.STRING,
        img_path: Sequelize.STRING,
      })
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('estampas');
  }
};
