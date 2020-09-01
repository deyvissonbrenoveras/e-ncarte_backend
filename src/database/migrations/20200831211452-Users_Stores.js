module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users_Stores', {
      // id: {
      //   primaryKey: true,
      //   allowNull: false,
      //   autoIncrement: true,
      //   type: Sequelize.INTEGER,
      // },
      userId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      storeId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Stores',
          key: 'id',
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('Users_Stores');
  },
};
