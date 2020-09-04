import Sequelize, { Model } from 'sequelize';

class Product extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        description: Sequelize.STRING,
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
    this.belongsToMany(models.Store, {
      as: 'Stores',
      through: 'Products_Stores',
      foreignKey: 'productId',
    });
  }
}
export default Product;
