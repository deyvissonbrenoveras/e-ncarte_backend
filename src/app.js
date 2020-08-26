import express from 'express';
import routes from './routes';

class App {
  constructor() {
    this.server = express();
    this.init();
  }

  init() {
    this.server.use(express.json());
    this.server.use(routes);
  }
}

export default new App().server;
