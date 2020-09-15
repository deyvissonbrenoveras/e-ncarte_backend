import Sequelize, { Model } from 'sequelize';

class Partner extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        site: Sequelize.STRING,
        agentWhatsapp: Sequelize.STRING,
        regionalAgent: Sequelize.STRING,
        sponsorship: Sequelize.BOOLEAN,
      },
      {
        sequelize,
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.File, { foreignKey: 'logoId', as: 'logo' });
    this.belongsToMany(models.Store, {
      as: 'stores',
      through: 'Partners_Stores',
      foreignKey: 'partnerId',
    });
  }
}
export default Partner;