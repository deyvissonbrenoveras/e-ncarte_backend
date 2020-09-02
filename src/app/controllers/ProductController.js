import * as Yup from 'yup';
import User from '../models/User';
import Product from '../models/Product';

class ProductController {
  async store(req, res) {
    // SCHEMA VALIDATION
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      fileId: Yup.number().min(1).integer().required(),
      description: Yup.string().notRequired(),
      price: Yup.number().required(),
      featured: Yup.boolean().notRequired(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Produto não validado' });
    }

    // CHECK USER PRIVILEGES
    const adminUser = await User.findByPk(req.userId);
    if (!adminUser.isStoreAdmin()) {
      return res
        .status(401)
        .json({ error: 'Você não tem permissão para cadastrar produtos' });
    }

    const product = await Product.create(req.body);
    return res.json(product);
  }

  async update(req, res) {
    // SCHEMA VALIDATION
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      fileId: Yup.number().min(1).integer().required(),
      description: Yup.string().notRequired(),
      price: Yup.number().required(),
      featured: Yup.boolean().notRequired(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Produto não validado' });
    }

    // --->>>>> MISSING STORE VALIDATION IF USER ISN'T ADMIN <<<<<---

    // CHECK USER PRIVILEGES
    const adminUser = await User.findByPk(req.userId);
    if (!adminUser.isAdmin()) {
      return res
        .status(401)
        .json({ error: 'Você não tem permissão para cadastrar produtos' });
    }

    // CHECK IF PRODUCT EXISTS
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(400).json({ error: 'O produto informado não existe' });
    }

    await product.update(req.body);

    return res.json(product);
  }
}

export default new ProductController();
