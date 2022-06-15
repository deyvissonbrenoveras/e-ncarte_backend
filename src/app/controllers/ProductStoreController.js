import * as Yup from 'yup';
import Product from '../models/Product';
import Store from '../models/Store';
import User from '../models/User';
import ProductStore from '../models/ProductStore';
import Log from '../models/Log';

class ProductStoreController {
  async store(req, res) {
    const { productId } = req.params;
    const { stores } = req.body;
    const { userId } = req;

    // SCHEMA VALIDATION
    const schema = Yup.object().shape({
      productId: Yup.number().positive().required(),
      stores: Yup.array().of(
        Yup.object().shape({
          storeId: Yup.number().positive().integer().required(),
          customPrice: Yup.number().positive().nullable(),
        })
      ),
    });

    if (!(await schema.isValid({ productId, stores }))) {
      return res
        .status(400)
        .json({ error: 'Associação Produto - Loja não validada' });
    }

    // CHECK USER PRIVILEGIES
    const user = await User.findByPk(userId);
    const storesAllowed = await user.hasStores(
      stores.map((store) => store.storeId)
    );

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

    stores.forEach(async (store) => {
      const productStore = await ProductStore.findOne({
        where: { storeId: store.storeId, productId },
      });

      let oldPrice = '';
      let newPrice;

      if (productStore) {
        oldPrice = productStore.customPrice || '';
        productStore.customPrice = store.customPrice;
        await productStore.save();
      } else {
        await ProductStore.create({ ...store, productId });
      }

      newPrice = store.customPrice || '';
      console.log('Old: ', oldPrice);
      console.log('New: ', newPrice);
      if (oldPrice != store.customPrice) {
        await Log.create({
          userId,
          productId,
          storeId: store.storeId,
          oldValue: oldPrice,
          newValue: newPrice,
          field: 'Preço personalizado',
        });
      }
    });

    return res.json();
  }

  async update(req, res) {
    const { storeId, productId } = req.query;
    const { stores, products } = req.body;
    const { userId } = req;

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
      const user = await User.findByPk(userId);
      const storesAllowed = await user.hasStores(stores);

      if (!user.isAdmin() && !storesAllowed) {
        return res.status(401).json({
          error: 'Você não tem permissão para editar uma ou mais lojas',
        });
      }

      // CHECK IF PRODUCT EXISTS
      const product = await Product.findByPk(productId, {
        include: [
          {
            model: Store,
            as: 'stores',
            attributes: ['id'],
            through: { attributes: ['customPrice'] },
          },
        ],
      });
      if (!product) {
        return res
          .status(400)
          .json({ error: 'O produto informado não existe' });
      }
      const response = await product.removeStores(stores);

      stores.forEach((storeId) => {
        product.stores.forEach(async (store) => {
          if (storeId == store.id) {
            await Log.create({
              userId,
              productId,
              storeId: store.id,
              oldValue: store.Products_Stores.dataValues.customPrice || '',
              newValue: '',
              field: 'Preço personalizado',
            });
          }
        });
      });

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
      const store = await Store.findByPk(storeId, {
        include: [
          {
            model: Product,
            as: 'products',
            attributes: ['id'],
            through: { attributes: ['customPrice'] },
          },
        ],
      });
      if (!store) {
        return res.status(400).json({ error: 'A loja informada não existe' });
      }
      const response = await store.removeProducts(products);

      products.forEach((productId) => {
        store.products.forEach(async (product) => {
          if (productId == product.id) {
            await Log.create({
              userId,
              productId,
              storeId: store.id,
              oldValue: product.Products_Stores.dataValues.customPrice || '',
              newValue: '',
              field: 'Preço personalizado',
            });
          }
        });
      });

      return res.json(response);
    }
    return res.json();
  }
}

export default new ProductStoreController();
