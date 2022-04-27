import Sequelize, { Model } from 'sequelize';

class ProductStore extends Model {
  static init(sequelize) {
    super.init(
      {
        productId: { type: Sequelize.NUMBER, primaryKey: true },
        storeId: { type: Sequelize.NUMBER, primaryKey: true },
        customPrice: Sequelize.NUMBER,
      },
      {
        sequelize,
        tableName: 'Products_Stores',
      }
    );
    return this;
  }
}
export default ProductStore;
