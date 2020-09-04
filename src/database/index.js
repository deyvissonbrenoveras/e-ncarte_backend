import Sequelize from 'sequelize';

import User from '../app/models/User';
import File from '../app/models/File';
import Store from '../app/models/Store';
import Product from '../app/models/Product';
import Category from '../app/models/Category';

import databaseConfig from '../config/database';

const models = [User, File, Store, Product, Category];

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
