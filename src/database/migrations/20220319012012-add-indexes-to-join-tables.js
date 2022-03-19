'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface
      .addIndex('Partners_Stores', [
        { attribute: 'partnerId', order: 'DESC' },
        { attribute: 'storeId', order: 'DESC' },
      ])
      .then(() =>
        queryInterface.addIndex('Products_Partners', [
          { attribute: 'productId', order: 'DESC' },
          { attribute: 'partnerId', order: 'DESC' },
        ])
      )
      .then(() =>
        queryInterface.addIndex('Products_Stores', [
          { attribute: 'productId', order: 'DESC' },
          'storeId',
        ])
      )
      .then(() =>
        queryInterface.addIndex('Users_Stores', [
          { attribute: 'userId', order: 'DESC' },
          { attribute: 'storeId', order: 'DESC' },
        ])
      );
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface
      .removeIndex('Partners_Stores', ['partnerId', 'storeId'])
      .then(() =>
        queryInterface.removeIndex('Products_Partners', [
          'productId',
          'partnerId',
        ])
      )
      .then(() =>
        queryInterface.removeIndex('Products_Stores', ['productId', 'storeId'])
      )
      .then(() =>
        queryInterface.removeIndex('Users_Stores', ['userId', 'storeId'])
      );
  },
};
