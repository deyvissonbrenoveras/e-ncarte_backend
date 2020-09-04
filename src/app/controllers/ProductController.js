import * as Yup from 'yup';
import User from '../models/User';
import Product from '../models/Product';
import Category from '../models/Category';

class ProductController {
  async store(req, res) {
    // SCHEMA VALIDATION
    const schema = Yup.object().shape({
      name: Yup.string().max(100).required(),
      fileId: Yup.number().positive().integer().required(),
      description: Yup.string().max(1000).notRequired(),
      price: Yup.number().required(),
      featured: Yup.boolean().notRequired(),
      categoryId: Yup.number().positive().notRequired(),
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

    // CHECK IF CATEGORY EXISTS
    const { categoryId } = req.body;
    if (categoryId) {
      const category = await Category.findByPk(categoryId);
      if (!category) {
        return res
          .status(400)
          .json({ error: 'A categoria informada não existe' });
      }
    }

    const product = await Product.create(req.body);
    return res.json(product);
  }

  async update(req, res) {
    // SCHEMA VALIDATION
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      fileId: Yup.number().positive().integer().required(),
      description: Yup.string().notRequired(),
      price: Yup.number().required(),
      featured: Yup.boolean().notRequired(),
      categoryId: Yup.number().positive().notRequired(),
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

    // CHECK IF CATEGORY EXISTS
    const { categoryId } = req.body;
    if (categoryId) {
      const category = await Category.findByPk(categoryId);
      if (!category) {
        return res
          .status(400)
          .json({ error: 'A categoria informada não existe' });
      }
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
