import Sequelize, { Model } from 'sequelize';

class UserStore extends Model {
  static init(sequelize) {
    super.init(
      {
        userId: { type: Sequelize.INTEGER, as: 'userId' },
        storeId: Sequelize.INTEGER,
      },
      {
        sequelize,
        modelName: 'Users_Stores',
      }
    );
    return this;
  }
}

export default UserStore;
