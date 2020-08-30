module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Stores', {
      id: {
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        type: Sequelize.INTEGER,
      },
      logoId: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: {
          model: 'Files',
          key: 'id',
        },
      },
      coverId: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: {
          model: 'Files',
          key: 'id',
        },
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      url: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true,
      },
      address: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      city: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      phone: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      whatsapp: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      instagram: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      facebook: {
        allowNull: true,
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
    await queryInterface.dropTable('Stores');
  },
};
