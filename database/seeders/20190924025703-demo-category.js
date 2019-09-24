'use strict';

const uuid = require('uuid/v4')

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('categories', [
      {
        id: uuid(),
        name: 'Smartphone',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuid(),
        name: 'Laptop and Notebook',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuid(),
        name: 'Fashion',
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
  }
};
