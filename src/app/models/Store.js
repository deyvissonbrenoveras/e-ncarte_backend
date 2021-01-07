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
        shelfLife: Sequelize.DATE,
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
      as: 'admins',
      through: 'Users_Stores',
      foreignKey: 'storeId',
    });
    this.belongsToMany(models.Product, {
      as: 'products',
      through: 'Products_Stores',
      foreignKey: 'storeId',
    });
    this.belongsToMany(models.Partner, {
      as: 'partners',
      through: 'Partners_Stores',
      foreignKey: 'storeId',
    });
  }
}

export default Store;
