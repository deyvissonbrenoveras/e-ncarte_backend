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
import ProductStore from './app/controllers/ProductStore';
import PartnerController from './app/controllers/PartnerController';
import PartnerStoreController from './app/controllers/PartnerStoreController';

const upload = multer(multerOptions);

const routes = new Router();

routes.post('/sessions', SessionController.store);
routes.post('/users', UserController.store);

routes.get('/stores/:id', StoreController.index);

// AUTHENTICATION MIDLEWARE
routes.use(authMiddleware);
// AUTHENTICATION REQUIRED FOR ROUTES BELOW

routes.put('/users/:id', UserController.update);

routes.post('/stores', StoreController.store);
routes.put('/stores/:id', StoreController.update);

routes.post('/users_stores/:userId/:storeId', UserStoreController.store);
routes.delete('/users_stores/:userId/:storeId', UserStoreController.delete);

routes.post('/products', ProductController.store);
routes.put('/products/:id', ProductController.update);

routes.get('/categories', CategoryController.show);
routes.post('/categories', CategoryController.store);
routes.put('/categories/:id', CategoryController.update);

routes.post('/products_stores/:productId', ProductStore.store);
routes.delete('/products_stores/:productId', ProductStore.delete);

routes.post('/partners', PartnerController.store);
routes.put('/partners/:id', PartnerController.update);

routes.post('/partners_stores/:partnerId', PartnerStoreController.store);
routes.delete('/partners_stores/:partnerId', PartnerStoreController.delete);

routes.post('/files', upload.single('image'), FileController.store);
export default routes;
