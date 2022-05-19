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
}
export default Log;
