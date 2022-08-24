import * as Yup from 'yup';
import User from '../models/User';
import Product from '../models/Product';
import Category from '../models/Category';
import File from '../models/File';
import Store from '../models/Store';
import Partner from '../models/Partner';
import Log from '../models/Log';

import PriceTypeEnum from '../util/PriceTypeEnum';

class ProductController {
  async index(req, res) {
    const { id } = req.params;
    const product = await Product.findByPk(id, {
      attributes: [
        'id',
        'name',
        'description',
        'priceType',
        'price',
        'featured',
        'fractionedQuantity',
        'categoryId',
      ],
      include: [
        {
          model: File,
          as: 'image',
          attributes: ['id', 'url', 'path'],
        },
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name'],
        },
        {
          model: Store,
          as: 'stores',
          attributes: ['id'],
          through: { attributes: ['customPrice'] },
        },
        {
          model: Partner,
          as: 'partners',
          attributes: ['id'],
        },
      ],
    });
    // CHECK IF EXISTS
    if (!product) {
      return res.status(400).json({ error: 'O produto informado não existe' });
    }
    return res.json(product);
  }

  async show(req, res) {
    const user = await User.findByPk(req.userId);
    if (!user.isAdmin()) {
      return res
        .status(401)
        .json({ error: 'Você não tem permissão para a ação' });
    }
    const products = await Product.findAll({
      attributes: ['id', 'name', 'description', 'price', 'featured'],
      include: [
        {
          model: File,
          as: 'image',
          attributes: ['id', 'url', 'path'],
        },
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name'],
        },
      ],
    });
    return res.json(products);
  }

  async store(req, res) {
    // SCHEMA VALIDATION
    const schema = Yup.object().shape({
      name: Yup.string().max(100).required(),
      fileId: Yup.number().positive().integer().required(),
      description: Yup.string().max(1000),
      priceType: Yup.number()
        .min(PriceTypeEnum.DEFAULT)
        .max(PriceTypeEnum.SPECIAL_OFFER)
        .notRequired(),
      price: Yup.number().when('priceType', {
        is: PriceTypeEnum.SPECIAL_OFFER,
        then: Yup.number().nullable().notRequired(),
        otherwise: Yup.number().positive().required(),
      }),
      featured: Yup.boolean(),
      fractionedQuantity: Yup.boolean(),
      categoryId: Yup.number().positive().nullable(true),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Produto não validado' });
    }

    // CHANGE PRICE IF PRICE TYPE IS SPECIAL_OFFER
    if (req.body.priceType === PriceTypeEnum.SPECIAL_OFFER) {
      req.body.price = 0;
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
      description: Yup.string(),
      priceType: Yup.number()
        .min(PriceTypeEnum.DEFAULT)
        .max(PriceTypeEnum.SPECIAL_OFFER)
        .notRequired(),
      price: Yup.number().when('priceType', {
        is: PriceTypeEnum.SPECIAL_OFFER,
        then: Yup.number().nullable().notRequired(),
        otherwise: Yup.number().positive().required(),
      }),
      featured: Yup.boolean().notRequired(),
      fractionedQuantity: Yup.boolean().notRequired(),
      categoryId: Yup.number().positive().nullable(true),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Produto não validado' });
    }

    // CHANGE PRICE IF PRICE TYPE IS SPECIAL_OFFER
    if (req.body.priceType === PriceTypeEnum.SPECIAL_OFFER) {
      req.body.price = 0;
    }

    // CHECK IF PRODUCT EXISTS
    const { id } = req.params;
    const product = await Product.findByPk(id, {
      include: {
        model: Store,
        as: 'stores',
      },
    });
    if (!product) {
      return res.status(400).json({ error: 'O produto informado não existe' });
    }

    // CHECK USER PRIVILEGES
    // STORE VALIDATION IF USER ISN'T ADMIN
    const user = await User.findByPk(req.userId);
    if (!user.isAdmin()) {
      const userStores = await user.getStores();
      let exist = false;
      for (let i = 0; i < userStores.length; i += 1) {
        for (let k = 0; k < product.stores.length; k += 1) {
          if (userStores[i].id === product.stores[k].id) {
            exist = true;
          }
        }
      }
      if (!exist) {
        return res
          .status(401)
          .json({ error: 'Você não tem permissão para editar esse produto' });
      }
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

    const oldPrice =
      product.priceType === PriceTypeEnum.SPECIAL_OFFER
        ? 'OFERTA ESPECIAL'
        : product.price;

    const newPrice =
      req.body.priceType === PriceTypeEnum.SPECIAL_OFFER
        ? 'OFERTA ESPECIAL'
        : req.body.price;

    await product.update(req.body);

    oldPrice != newPrice &&
      (await Log.create({
        userId: user.id,
        productId: id,
        oldValue: oldPrice,
        newValue: newPrice,
        field: 'Preço padrão',
      }));

    return res.json(product);
  }
}

export default new ProductController();
