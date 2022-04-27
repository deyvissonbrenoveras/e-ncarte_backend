'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Products_Stores', 'customPrice', {
      allowNull: true,
      defaultValue: null,
      type: Sequelize.DOUBLE,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('Products_Stores', 'customPrice');
  },
};
