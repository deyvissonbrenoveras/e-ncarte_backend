import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

import Privilege from '../util/PrivilegeEnum';

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        passwordHash: Sequelize.STRING,
        privilege: Sequelize.INTEGER,
      },
      {
        sequelize,
      }
    );
    this.addHook('beforeSave', async (user) => {
      if (user.password) {
        user.passwordHash = await bcrypt.hash(user.password, 8);
      }
    });
    return this;
  }

  isRoot() {
    return this.privilege === Privilege.ROOT;
  }

  isAdmin() {
    return (
      this.privilege === Privilege.ROOT ||
      this.privilege === Privilege.SYSTEM_ADMINISTRATOR
    );
  }

  isStoreAdmin() {
    return (
      this.privilege === Privilege.ROOT ||
      this.privilege === Privilege.SYSTEM_ADMINISTRATOR ||
      this.privilege === Privilege.STORE_ADMINISTRATOR
    );
  }

  static associate(models) {
    this.belongsToMany(models.Store, {
      as: 'stores',
      through: 'Users_Stores',
      foreignKey: 'userId',
    });
  }
}

export default User;
