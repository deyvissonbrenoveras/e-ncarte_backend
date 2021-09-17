module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Stores', 'primaryColor', {
      allowNull: false,
      defaultValue: '#fff',
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn('Stores', 'secondaryColor', {
      allowNull: false,
      defaultValue: '#fff',
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn('Stores', 'tertiaryColor', {
      allowNull: false,
      defaultValue: '#fff',
      type: Sequelize.STRING,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('Stores', 'primaryColor');
    await queryInterface.removeColumn('Stores', 'secondaryColor');
    await queryInterface.removeColumn('Stores', 'tertiaryColor');
  },
};
