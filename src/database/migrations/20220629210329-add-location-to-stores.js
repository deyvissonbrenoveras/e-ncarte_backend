'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Stores', 'city');
    await queryInterface.addColumn('Stores', 'cityId', {
      allowNull: true,
      type: Sequelize.INTEGER,
      references: {
        model: 'Cities',
        key: 'id',
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Stores', 'cityId');
    await queryInterface.addColumn('Stores', 'city', {
      allowNull: true,
      type: Sequelize.STRING,
    });
  },
};
