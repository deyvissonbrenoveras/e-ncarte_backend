module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Partners', {
      id: {
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        type: Sequelize.INTEGER,
      },
      logoId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Files',
          key: 'id',
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        },
      },
      name: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING,
      },
      site: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      regionalAgent: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      agentWhatsapp: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      sponsorship: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        default: false,
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
    await queryInterface.dropTable('Partners');
  },
};
