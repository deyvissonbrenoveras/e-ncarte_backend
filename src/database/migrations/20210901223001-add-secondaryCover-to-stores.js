'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Stores', 'secondaryCoverId', {
      allowNull: true,
      type: Sequelize.INTEGER,
      references: {
        model: 'Files',
        key: 'id',
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Stores', 'secondaryCoverId');
  },
};
