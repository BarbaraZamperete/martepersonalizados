'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
     await queryInterface.createTable('categorias',
     {
       idCategoria: {
         type: Sequelize.INTEGER,
         autoIncrement: true,
         allowNull: false,
         primaryKey: true,
       },
       nome: Sequelize.STRING,
       // image: Sequelize.STRING
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
     await queryInterface.dropTable('categorias');
  }
};
