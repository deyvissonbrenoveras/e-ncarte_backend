import * as Yup from 'yup';
import Product from '../models/Product';
import Store from '../models/Store';
import User from '../models/User';

class ProductStoreController {
  async store(req, res) {
    const { productId } = req.params;
    const { stores } = req.body;

    // SCHEMA VALIDATION
    const schema = Yup.object().shape({
      productId: Yup.number().positive().required(),
      stores: Yup.array().of(Yup.number()).required(),
    });
    if (!(await schema.isValid({ productId, stores }))) {
      return res
        .status(400)
        .json({ error: 'Associação Produto - Loja não validada' });
    }

    // CHECK USER PRIVILEGIES
    const user = await User.findByPk(req.userId);

    const storesAllowed = await user.hasStores(stores);

    if (!user.isAdmin() && !storesAllowed) {
      return res.status(401).json({
        error: 'Você não tem permissão para editar uma ou mais lojas',
      });
    }

    // CHECK IF PRODUCT EXISTS
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(400).json({ error: 'O produto informado não existe' });
    }
    const response = await product.addStores(stores);
    return res.json(response);
  }

  async update(req, res) {
    const { storeId, productId } = req.query;
    const { stores, products } = req.body;
    // SCHEMA VALIDATION
    const schema = Yup.object().shape({
      productId: Yup.number().positive(),
      stores: Yup.array().when('productId', {
        is: (prodId) => prodId,
        then: Yup.array().of(Yup.number()).required(),
      }),
      storeId: Yup.number().positive(),
      products: Yup.array().when('storeId', {
        is: (strId) => strId,
        then: Yup.array().of(Yup.number()).required(),
      }),
    });
    if (!(await schema.isValid({ productId, stores, storeId, products }))) {
      return res
        .status(400)
        .json({ error: 'Desassociação Produto - Loja não validada' });
    }

    if (productId) {
      // CHECK USER PRIVILEGIES
      const user = await User.findByPk(req.userId);
      const storesAllowed = await user.hasStores(stores);

      if (!user.isAdmin() && !storesAllowed) {
        return res.status(401).json({
          error: 'Você não tem permissão para editar uma ou mais lojas',
        });
      }

      // CHECK IF PRODUCT EXISTS
      const product = await Product.findByPk(productId);
      if (!product) {
        return res
          .status(400)
          .json({ error: 'O produto informado não existe' });
      }
      const response = await product.removeStores(stores);
      return res.json(response);
    }

    if (storeId) {
      // CHECK USER PRIVILEGIES
      const user = await User.findByPk(req.userId);
      const storesAllowed = await user.hasStore(storeId);

      if (!user.isAdmin() && !storesAllowed) {
        return res.status(401).json({
          error: 'Você não tem permissão para editar uma ou mais lojas',
        });
      }

      // CHECK IF STORE EXISTS
      const store = await Store.findByPk(storeId);
      if (!store) {
        return res.status(400).json({ error: 'A loja informada não existe' });
      }
      const response = await store.removeProducts(products);
      return res.json(response);
    }
    return res.json();
  }
}

export default new ProductStoreController();
