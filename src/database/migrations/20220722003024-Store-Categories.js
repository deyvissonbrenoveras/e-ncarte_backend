module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('StoreCategories', {
      id: {
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        type: Sequelize.INTEGER,
      },
      name: {
        unique: true,
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
    await queryInterface.addColumn('Stores', 'storeCategoryId', {
      allowNull: true,
      type: Sequelize.INTEGER,
      references: {
        model: 'StoreCategories',
        key: 'id',
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('Stores', 'storeCategoryId');
    await queryInterface.dropTable('StoreCategories');
  },
};
