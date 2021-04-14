module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Products', 'description', {
      allowNull: true,
      type: Sequelize.TEXT,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Products', 'description', {
      allowNull: true,
      type: Sequelize.STRING,
    });
  },
};
