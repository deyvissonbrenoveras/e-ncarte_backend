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
    Store.belongsTo(models.File, { foreignKey: 'logoId', as: 'logo' });
    Store.belongsTo(models.File, { foreignKey: 'coverId', as: 'cover' });
    // Store.hasOne(models.File, { foreignKey: 'coverId' });
  }
}

export default Store;
