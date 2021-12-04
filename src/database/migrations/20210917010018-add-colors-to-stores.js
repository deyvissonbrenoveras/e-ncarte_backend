module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Stores', 'primaryColor', {
      allowNull: false,
      defaultValue: '#1D53A5',
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn('Stores', 'secondaryColor', {
      allowNull: false,
      defaultValue: '#B4B4B4',
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn('Stores', 'tertiaryColor', {
      allowNull: false,
      defaultValue: '#000',
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn('Stores', 'quaternaryColor', {
      allowNull: false,
      defaultValue: '#fff',
      type: Sequelize.STRING,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('Stores', 'primaryColor');
    await queryInterface.removeColumn('Stores', 'secondaryColor');
    await queryInterface.removeColumn('Stores', 'tertiaryColor');
    await queryInterface.removeColumn('Stores', 'quaternaryColor');
  },
};
