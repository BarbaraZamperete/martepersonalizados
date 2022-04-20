'use strict';
const bcrypt = require('bcrypt');
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
   const salt = await bcrypt.genSalt(10);
   const senha = await bcrypt.hash('marteAdm2022', salt)
  //  await queryInterface.bulkInsert('users', [{
  //    login: "marteAdm",
  //    senha: senha
  //  }])
      await queryInterface.sequelize.query(`INSERT INTO users  
      (
        login, senha
      ) VALUES(
        "marteAdm",
        "${senha}"
      )
      `)
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
     await queryInterface.bulkDelete('users', null, {});
  }
};
