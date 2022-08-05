import Sequelize, { Model } from 'sequelize';

class Store extends Model {
  static init(sequelize) {
    super.init(
      {
        coverId: Sequelize.INTEGER,
        secondaryCoverId: Sequelize.INTEGER,
        logoId: Sequelize.INTEGER,
        name: Sequelize.STRING,
        url: Sequelize.STRING,
        address: Sequelize.STRING,
        cityId: Sequelize.STRING,
        storeCategoryId: Sequelize.STRING,
        phone: Sequelize.STRING,
        whatsapp: Sequelize.STRING,
        instagram: Sequelize.STRING,
        facebook: Sequelize.STRING,
        active: Sequelize.BOOLEAN,
        shelfLifeStart: Sequelize.DATE,
        shelfLifeEnd: Sequelize.DATE,
        primaryColor: Sequelize.STRING,
        secondaryColor: Sequelize.STRING,
        tertiaryColor: Sequelize.STRING,
        quaternaryColor: Sequelize.STRING,
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
    this.belongsTo(models.File, {
      foreignKey: 'secondaryCoverId',
      as: 'secondaryCover',
    });
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
    this.belongsTo(models.City, { foreignKey: 'cityId', as: 'city' });
    this.belongsTo(models.StoreCategory, { foreignKey: 'storeCategoryId', as: 'storeCategory' });
  }
}

export default Store;
