import * as Yup from 'yup';
import Category from '../models/Category';
import User from '../models/User';

class CategoryController {
  async show(req, res) {
    const categories = await Category.findAll({ attributes: ['id', 'name'] });
    return res.json(categories);
  }

  async store(req, res) {
    // SCHEMA VALIDATION
    const schema = Yup.object().shape({
      name: Yup.string().max(100).required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Categoria não validada' });
    }

    // CHECK USER PRIVILEGIE
    const user = await User.findByPk(req.userId);
    if (!user.isStoreAdmin()) {
      return res
        .status(401)
        .json({ error: 'Você não tem permissão para criar uma categoria' });
    }

    // CHECK IF CATEGORY ALREADY EXIXTS
    const { name } = req.body;
    const categoryExists = await Category.findOne({ where: { name } });
    if (categoryExists) {
      return res.status(400).json({ error: 'A categoria já existe' });
    }

    const category = await Category.create(req.body);
    return res.json(category);
  }

  async update(req, res) {
    const { id } = req.params;
    // SCHEMA VALIDATION
    const schema = Yup.object().shape({
      name: Yup.string().max(100).required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Categoria não validada' });
    }

    // CHECK USER PRIVILEGIE
    const user = await User.findByPk(req.userId);
    if (!user.isStoreAdmin()) {
      return res
        .status(401)
        .json({ error: 'Você não tem permissão para criar uma categoria' });
    }

    // CHECK IF CATEGORY EXISTS
    const category = await Category.findByPk(id);
    if (!category) {
      return res
        .status(400)
        .json({ error: 'A categoria informada não existe' });
    }

    // CHECK IF CATEGORY ALREADY EXIXTS
    const { name } = req.body;
    const categoryExists = await Category.findOne({ where: { name } });
    if (categoryExists && categoryExists.id !== id) {
      return res.status(400).json({ error: 'A categoria já existe' });
    }
    await category.update(req.body);
    return res.json(category);
  }
}

export default new CategoryController();
