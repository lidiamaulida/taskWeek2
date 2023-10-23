'use strict';

/** @type {import('sequelize-cli').Migration} */
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


    await queryInterface.bulkInsert('users', [
        {
        name: 'Rahma',
        email: "rah@mail.com",
        password: 'root',
        createdAt: "2023-10-18",
        updatedAt: "2023-10-18"
        },{
        name: 'Sella',
        email: "rah@mail.com",
        password: 'root',
        createdAt: "2023-10-18",
        updatedAt: "2023-10-18"
        }     
      ], {});
  },

  async down (queryInterface, Sequelize) {

    await queryInterface.bulkDelete('users', null, {});


    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
