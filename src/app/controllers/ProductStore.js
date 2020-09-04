import * as Yup from 'yup';
import Store from '../models/Store';
import Product from '../models/Product';

class ProductStore {
  async store(req, res) {
    const { productId, storeId } = req.params;

    // SCHEMA VALIDATION
    const schema = Yup.object().shape({
      productId: Yup.number().positive().required(),
      storeId: Yup.number().positive().required(),
    });
    if (!(await schema.isValid(req.params))) {
      return res
        .status(400)
        .json({ error: 'Associação Produto - Loja não validada' });
    }

    // CHECK IF PRODUCT EXISTS
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(400).json({ error: 'O produto informado não existe' });
    }

    // CHECK IF STORE EXISTS
    const store = await Store.findByPk(storeId);
    if (!store) {
      return res.status(400).json({ error: 'A loja informada não existe' });
    }

    // CHECK IF ASSOCIATION HAS ALREADY BEEN MADE
    const productStoreExists = await store.getProducts({
      where: { id: productId },
    });

    if (productStoreExists && productStoreExists.length > 0) {
      return res
        .status(400)
        .json({ error: 'O produto já faz parte dessa loja' });
    }

    // MUDAR PARA ASSOCIACAO POR ARRAY

    const productStore = await store.addProduct(productId);

    return res.json(productStore);
  }
}

export default new ProductStore();
