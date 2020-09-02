import Sequelize, { Model } from 'sequelize';

class Store extends Model {
  static init(sequelize) {
    super.init(
      {
        coverId: Sequelize.INTEGER,
        logoId: Sequelize.INTEGER,
        name: Sequelize.STRING,
        url: Sequelize.STRING,
        address: Sequelize.STRING,
        city: Sequelize.STRING,
        phone: Sequelize.STRING,
        whatsapp: Sequelize.STRING,
        instagram: Sequelize.STRING,
        facebook: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.File, { foreignKey: 'logoId', as: 'logo' });
    this.belongsTo(models.File, { foreignKey: 'coverId', as: 'cover' });
    this.belongsToMany(models.User, {
      as: 'Admins',
      through: 'Users_Stores',
      foreignKey: 'storeId',
    });
    // Store.hasOne(models.File, { foreignKey: 'coverId' });
  }
}

export default Store;
