module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Products', 'priceType', {
      allowNull: false,
      defaultValue: 0,
      type: Sequelize.INTEGER,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('Products', 'priceType');
  },
};
