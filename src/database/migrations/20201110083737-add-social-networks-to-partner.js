module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Partners', 'facebook', {
      allowNull: true,
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn('Partners', 'instagram', {
      allowNull: true,
      type: Sequelize.STRING,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('Partners', 'facebook');
    await queryInterface.removeColumn('Partners', 'instagram');
  },
};
