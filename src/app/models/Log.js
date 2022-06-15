import Sequelize, { Model } from 'sequelize';

class Log extends Model {
  static init(sequelize) {
    super.init(
      {
        userId: Sequelize.NUMBER,
        productId: Sequelize.NUMBER,
        storeId: Sequelize.NUMBER,
        oldValue: Sequelize.STRING,
        newValue: Sequelize.STRING,
        field: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );
    return this;
  }
  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    this.belongsTo(models.Product, { foreignKey: 'productId', as: 'product' });
    this.belongsTo(models.Store, { foreignKey: 'storeId', as: 'store' });
  }
}
export default Log;
