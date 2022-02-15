import express from 'express';
import { resolve } from 'path';
import 'dotenv/config';
import compression from 'compression';
import cors from 'cors';
import routes from './routes';
import './database';

class App {
  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(compression());
    this.server.use(cors());
    this.server.use(express.json());
    this.server.use(
      '/files',
      express.static(resolve(__dirname, '..', 'tmp', 'uploads'))
    );
    // FRONTEND REACT
    this.server.use(express.static(resolve(__dirname, '../client')));
  }

  routes() {
    this.server.use('/api', routes);
    //HOMEPAGE;
    this.server.get('/', (req, res) => {
      res.sendFile(resolve(__dirname, '../client/homepage/index.html'));
    });
    // FRONTEND REACT
    this.server.get('/*', (req, res) => {
      res.sendFile(resolve(__dirname, '../client/webapp/index.html'));
    });
  }
}

export default new App().server;
