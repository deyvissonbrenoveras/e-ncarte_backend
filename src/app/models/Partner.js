import Sequelize, { Model } from 'sequelize';

class Partner extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        site: Sequelize.STRING,
        whatsapp: Sequelize.STRING,
        sponsorship: Sequelize.BOOLEAN,
      },
      {
        sequelize,
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.File, { foreignKey: 'logoId', as: 'logo' });
  }
}
export default Partner;
