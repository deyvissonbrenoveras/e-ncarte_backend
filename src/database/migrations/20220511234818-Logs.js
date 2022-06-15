'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Logs', {
      id: {
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        },
      },
      productId: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: {
          model: 'Products',
          key: 'id',
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        },
      },
      storeId: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: {
          model: 'Stores',
          key: 'id',
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        },
      },
      oldValue: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      newValue: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      field: {
        allowNull: false,
        type: Sequelize.STRING,
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
    await queryInterface.dropTable('Logs');
  },
};
