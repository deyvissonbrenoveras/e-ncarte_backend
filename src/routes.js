import { Router } from 'express';
import multer from 'multer';

import SessionController from './app/controllers/SessionController';
import UserController from './app/controllers/UserController';

import authMiddleware from './app/middlewares/auth';

import multerOptions from './config/multer';

import FileController from './app/controllers/FileController';
import StoreController from './app/controllers/StoreController';
import UserStoreController from './app/controllers/UserStoreController';
import ProductController from './app/controllers/ProductController';
import CategoryController from './app/controllers/CategoryController';
import ProductStoreController from './app/controllers/ProductStoreController';
import PartnerController from './app/controllers/PartnerController';
import PartnerStoreController from './app/controllers/PartnerStoreController';
import ProductPartnerController from './app/controllers/ProductPartnerController';
import LogController from './app/controllers/LogController';

const upload = multer(multerOptions);

const routes = new Router();

routes.post('/sessions', SessionController.store);
routes.post('/users', UserController.store);

routes.get('/stores', StoreController.show);
routes.get('/store', StoreController.index);

routes.get('/partners/:id', PartnerController.index);

// AUTHENTICATION MIDLEWARE
routes.use(authMiddleware);
// AUTHENTICATION REQUIRED FOR ROUTES BELOW
routes.get('/users', UserController.show);
routes.get('/users/:id', UserController.index);
routes.put('/users/:id', UserController.update);

routes.post('/stores', StoreController.store);
routes.put('/stores/:id', StoreController.update);

routes.post('/users_stores/:userId', UserStoreController.store);
routes.put('/users_stores/:userId', UserStoreController.update);

routes.get('/products', ProductController.show);
routes.get('/products/:id', ProductController.index);
routes.post('/products', ProductController.store);
routes.put('/products/:id', ProductController.update);

routes.get('/categories/:id', CategoryController.index);
routes.get('/categories', CategoryController.show);
routes.post('/categories', CategoryController.store);
routes.put('/categories/:id', CategoryController.update);

routes.post('/products_stores/:productId', ProductStoreController.store);
routes.put('/products_stores', ProductStoreController.update);

routes.post('/products_partners/:productId', ProductPartnerController.store);
routes.put('/products_partners', ProductPartnerController.update);

routes.get('/partners', PartnerController.show);
routes.post('/partners', PartnerController.store);
routes.put('/partners/:id', PartnerController.update);

routes.post('/partners_stores/:partnerId', PartnerStoreController.store);
routes.put('/partners_stores/:partnerId', PartnerStoreController.delete);

routes.post('/files', upload.single('file'), FileController.store);

routes.get('/logs', LogController.show);
export default routes;
