module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Partners', 'customizableField', {
      allowNull: true,
      type: Sequelize.TEXT,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Partners', 'customizableField', {
      allowNull: true,
      type: Sequelize.STRING,
    });
  },
};
