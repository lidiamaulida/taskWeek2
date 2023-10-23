'use strict';

const { ARRAY } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
      await queryInterface.bulkInsert('blogs', [{
        title:"Dumbways Mobile App - 2021",
        StartDate: "2023-10-21",
        endDate: "2023-10-21",
        description: "App that used for dumbways student",
        distanceTime: "2 bulan",
        technologies: ARRAY["NodeJS", "Reactjs", "Nextjs", "Typescript"],
        image: "img.jpg",
        createdAt: new Date(),
        updatedAt: new Date()
      }], {});
  },

  async down (queryInterface, Sequelize) {
      await queryInterface.bulkDelete('blogs', null, {});

  }
};


