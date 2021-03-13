module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Partners', 'customizableField', {
      allowNull: true,
      type: Sequelize.STRING,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('Partners', 'customizableField');
  },
};
