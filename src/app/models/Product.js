import Sequelize, { Model } from 'sequelize';

class Product extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        description: Sequelize.STRING,
        priceType: Sequelize.NUMBER,
        price: Sequelize.NUMBER,
        featured: Sequelize.BOOLEAN,
      },
      {
        sequelize,
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.File, { foreignKey: 'fileId', as: 'image' });
    this.belongsTo(models.Category, {
      foreignKey: 'categoryId',
      as: 'category',
    });

    this.belongsToMany(models.Store, {
      as: 'stores',
      through: 'Products_Stores',
      foreignKey: 'productId',
    });
    this.belongsToMany(models.Partner, {
      as: 'partners',
      through: 'Products_Partners',
      foreignKey: 'productId',
    });
  }
}
export default Product;
