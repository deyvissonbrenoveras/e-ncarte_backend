import * as Yup from 'yup';
import StoreCategory from '../models/StoreCategory';
import User from '../models/User';
import Store from '../models/Store';

class StoreCategoryController {
  async index(req, res) {
    const { id } = req.params;
    const storeCategory = await StoreCategory.findByPk(id);

    // CHECK IF EXISTS
    if (!storeCategory) {
      return res
        .status(400)
        .json({ error: 'A categoria informada não existe' });
    }
    return res.json(storeCategory);
  }

  async show(req, res) {
    const storeCategories = await StoreCategory.findAll({
      attributes: ['id', 'name'],
    });
    return res.json(storeCategories);
  }

  async store(req, res) {
    // SCHEMA VALIDATION
    const schema = Yup.object().shape({
      name: Yup.string().max(100).required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Categoria de loja não validada' });
    }

    // CHECK USER PRIVILEGIE
    const user = await User.findByPk(req.userId);
    if (!user.isAdmin()) {
      return res.status(401).json({
        error: 'Você não tem permissão para criar uma categoria de loja',
      });
    }

    // CHECK IF CATEGORY ALREADY EXIXTS
    const { name } = req.body;
    const storeCategoryExists = await StoreCategory.findOne({
      where: { name },
    });
    if (storeCategoryExists) {
      return res.status(400).json({ error: 'A categoria de loja já existe' });
    }

    const storeCategory = await StoreCategory.create(req.body);
    return res.json(storeCategory);
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
    if (!user.isAdmin()) {
      return res.status(401).json({
        error: 'Você não tem permissão para atualizar uma categoria de loja',
      });
    }

    // CHECK IF CATEGORY EXISTS
    const storeCategory = await StoreCategory.findByPk(id);
    if (!storeCategory) {
      return res
        .status(400)
        .json({ error: 'A categoria de loja informada não existe' });
    }

    // CHECK IF CATEGORY ALREADY EXIXTS
    const { name } = req.body;
    const storeCategoryExists = await StoreCategory.findOne({
      where: { name },
    });
    if (storeCategoryExists && storeCategoryExists.id !== id) {
      return res.status(400).json({ error: 'A categoria de loja já existe' });
    }
    await storeCategory.update(req.body);
    return res.json(storeCategory);
  }
  async showActiveStoreCategories(req, res) {
    const storeCategories = await Store.findAll({
      attributes: ['storeCategoryId'],
      group: ['storeCategoryId', 'storeCategory.id'],
      include: [
        {
          model: StoreCategory,
          as: 'storeCategory',
          attributes: ['id', 'name'],
        },
      ],
    });
    return res.json(storeCategories);
  }
}

export default new StoreCategoryController();
