import * as Yup from 'yup';
import Product from '../models/Product';
import User from '../models/User';

class ProductStore {
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

  async delete(req, res) {
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
        .json({ error: 'Desassociação Produto - Loja não validada' });
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
    const response = await product.removeStores(stores);
    return res.json(response);
  }
}

export default new ProductStore();
