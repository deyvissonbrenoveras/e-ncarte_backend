module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Stores', 'shelfLifeStart', {
      allowNull: true,
      defaultValue: null,
      type: Sequelize.DATE,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('Stores', 'shelfLifeStart');
  },
};
