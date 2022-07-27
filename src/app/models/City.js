import Sequelize, { Model } from 'sequelize';

class City extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        stateId: Sequelize.NUMBER,
      },
      {
        sequelize,
      }
    );
    return this;
  }
  static associate(models) {
    this.belongsTo(models.State, { foreignKey: 'stateId', as: 'state' });
  }
}
export default City;
