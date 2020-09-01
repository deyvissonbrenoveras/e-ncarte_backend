import Sequelize from 'sequelize';

import User from '../app/models/User';
import File from '../app/models/File';
import Store from '../app/models/Store';

import databaseConfig from '../config/database';
import UserStore from '../app/models/UserStore';

const models = [User, File, Store, UserStore];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);
    models.map((model) => model.init(this.connection));
    models.map(
      (model) => model.associate && model.associate(this.connection.models)
    );
  }
}

export default new Database();
