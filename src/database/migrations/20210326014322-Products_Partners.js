module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Products_Partners', {
      productId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Products',
          key: 'id',
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        },
      },
      partnerId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Partners',
          key: 'id',
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
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
    await queryInterface.dropTable('Products_Partners');
  },
};
