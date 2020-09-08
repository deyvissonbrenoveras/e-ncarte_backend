module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Partners_Stores', {
      partnerId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Partners',
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
    await queryInterface.dropTable('Partners_Stores');
  },
};
