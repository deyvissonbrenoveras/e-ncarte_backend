import * as Yup from 'yup';
import jwt from 'jsonwebtoken';
import authConfig from '../../config/auth';

import Store from '../models/Store';
import File from '../models/File';
import User from '../models/User';
import Product from '../models/Product';
import Category from '../models/Category';
import Partner from '../models/Partner';
import City from '../models/City';
import State from '../models/State';
import StoreCategory from '../models/StoreCategory';

class StoreController {
  async index(req, res) {
    const { url, id } = req.query;
    const where = url ? { url, active: true } : { id };

    const attributes = url
      ? [
          'id',
          'name',
          'url',
          'address',
          'cityId',
          'phone',
          'facebook',
          'whatsapp',
          'instagram',
          'shelfLifeStart',
          'shelfLifeEnd',
          'primaryColor',
          'secondaryColor',
          'tertiaryColor',
          'quaternaryColor',
        ]
      : null;

    const fileAttributes = url ? ['url', 'path'] : ['id', 'url', 'path'];

    const str = await Store.findOne({
      attributes,
      where,
      include: [
        {
          model: File,
          as: 'logo',
          attributes: fileAttributes,
        },
        {
          model: File,
          as: 'cover',
          attributes: fileAttributes,
        },
        {
          model: File,
          as: 'secondaryCover',
          attributes: fileAttributes,
        },
        {
          model: User,
          as: 'admins',
          attributes: url ? [] : ['id', 'name', 'email'],
        },
        {
          model: Product,
          as: 'products',
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
          through: { attributes: ['customPrice'] },
          include: [
            {
              model: File,
              as: 'image',
              fileAttributes,
            },
            {
              model: Category,
              as: 'category',
              fileAttributes,
            },
          ],
        },
        {
          model: Partner,
          as: 'partners',
          attributes: [
            'id',
            'name',
            'sponsorship',
            'site',
            'regionalAgent',
            'agentWhatsapp',
            'facebook',
            'instagram',
            'customizableField',
          ],
          include: [
            {
              model: File,
              as: 'logo',
              attributes: fileAttributes,
            },
          ],
        },
        {
          model: City,
          as: 'city',
          attributes: ['id', 'name'],
          include: [
            {
              model: State,
              as: 'state',
              attributes: ['id', 'name', 'uf'],
            },
          ],
        },
        {
          model: StoreCategory,
          as: 'storeCategory',
          attributes: ['id', 'name'],
        },
      ],
    });
    // CHECK IF EXISTS
    if (!str) {
      return res.status(404).json({ error: 'A loja informada não existe' });
    }
    return res.json(str);
  }

  async show(req, res) {
    const showInactive = req.query.showInactive === 'true';
    const include = [
      {
        model: File,
        as: 'logo',
        attributes: ['id', 'url', 'path'],
      },
      {
        model: File,
        as: 'cover',
        attributes: ['id', 'url', 'path'],
      },
      {
        model: File,
        as: 'secondaryCover',
        attributes: ['id', 'url', 'path'],
      },
      {
        model: City,
        as: 'city',
        attributes: ['id', 'name'],
        include: [
          {
            model: State,
            as: 'state',
            attributes: ['id', 'name', 'uf'],
          },
        ],
      },
    ];
    const where = showInactive ? {} : { active: true };
    let stores;
    // CHECK IF TOKE IS SENT AND RETURN THE CORRESPONDING STORES
    try {
      const token = req.headers.authorization.split(' ')[1];
      const validated = await jwt.verify(token, authConfig.secret);
      const user = await User.findByPk(validated.id);

      // DETERMINING WHICH STORES WILL BE RETURNED UNDER THE USER PRIVILEGE
      if (user.isAdmin()) {
        stores = await Store.findAll({
          include,
          where,
        });
      } else if (user.isStoreAdmin()) {
        stores = await user.getStores({
          include,
          where,
        });
      }
    } catch (err) {
      stores = await Store.findAll({
        include,
        where,
      });
    }

    return res.json(stores);
  }

  async store(req, res) {
    // SCHEMA VALIDATION
    const schema = Yup.object().shape({
      name: Yup.string().max(50).required(),
      url: Yup.string().max(50).required(),
      address: Yup.string().max(100),
      cityId: Yup.number().positive().required(),
      phone: Yup.string().max(100),
      instagram: Yup.string().max(100),
      whatsapp: Yup.string().max(100),
      facebook: Yup.string().max(100),
      shelfLifeStart: Yup.string()
        .nullable()
        .test('shelfLifeStart', 'erro', function checkShelfLife(
          shelfLifeStart
        ) {
          const timeStamp = Date.parse(shelfLifeStart);
          return (
            (!Number.isNaN(timeStamp) && timeStamp >= new Date(2020, 0, 1)) ||
            shelfLifeStart === null
          );
        }),
      shelfLifeEnd: Yup.string()
        .nullable()
        .test('shelfLifeEnd', 'erro', function checkShelfLife(shelfLifeEnd) {
          const timeStamp = Date.parse(shelfLifeEnd);
          return (
            (!Number.isNaN(timeStamp) && timeStamp >= new Date(2020, 0, 1)) ||
            shelfLifeEnd === null
          );
        }),
      primaryColor: Yup.string().required(),
      secondaryColor: Yup.string().required(),
      tertiaryColor: Yup.string().required(),
      quaternaryColor: Yup.string().required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Loja não validada' });
    }

    // CHECK USER PRIVILEGES WHEN UPDATING OTHER USER
    const adminUser = await User.findByPk(req.userId);

    if (!adminUser.isAdmin()) {
      return res
        .status(401)
        .json({ error: 'Você não tem permissão para a ação' });
    }

    // URL VALIDATION
    const str = await Store.findOne({ where: { url: req.body.url } });
    if (str) {
      return res.status(400).json({ error: 'A URL já existe' });
    }

    const {
      name,
      address,
      cityId,
      phone,
      whatsapp,
      instagram,
      facebook,
      shelfLifeEnd,
    } = await Store.create(req.body);

    return res.json({
      name,
      address,
      cityId,
      phone,
      whatsapp,
      instagram,
      facebook,
      shelfLifeEnd,
    });
  }

  async update(req, res) {
    const { userId } = req;
    const { id } = req.params;
    const { url } = req.body;
    // SCHEMA VALIDATION
    const schema = Yup.object().shape({
      logoId: Yup.number(),
      coverId: Yup.number().nullable(),
      secondaryCoverId: Yup.number().nullable(),
      name: Yup.string().max(50).required(),
      url: Yup.string().max(50).required(),
      address: Yup.string().max(100),
      cityId: Yup.number().positive().required(),
      phone: Yup.string().max(100),
      instagram: Yup.string().max(100),
      whatsapp: Yup.string().max(100),
      facebook: Yup.string().max(100),
      shelfLifeStart: Yup.string()
        .nullable()
        .test('shelfLifeStart', 'erro', function checkShelfLife(
          shelfLifeStart
        ) {
          const timeStamp = Date.parse(shelfLifeStart);
          return (
            (!Number.isNaN(timeStamp) && timeStamp >= new Date(2020, 0, 1)) ||
            shelfLifeStart === null
          );
        }),
      shelfLifeEnd: Yup.string()
        .nullable()
        .test('shelfLifeEnd', 'erro', function checkShelfLife(shelfLifeEnd) {
          const timeStamp = Date.parse(shelfLifeEnd);
          return (
            (!Number.isNaN(timeStamp) && timeStamp >= new Date(2020, 0, 1)) ||
            shelfLifeEnd === null
          );
        }),
      primaryColor: Yup.string()
        .matches('^#(?:[0-9a-fA-F]{3}){1,2}$')
        .required(),
      secondaryColor: Yup.string()
        .matches('^#(?:[0-9a-fA-F]{3}){1,2}$')
        .required(),
      tertiaryColor: Yup.string()
        .matches('^#(?:[0-9a-fA-F]{3}){1,2}$')
        .required(),
      quaternaryColor: Yup.string()
        .matches('^#(?:[0-9a-fA-F]{3}){1,2}$')
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Loja não validada' });
    }

    // CHECK IF USER HAS PRIVILEGE TO UPDATE THE STORE
    const user = await User.findByPk(userId);
    if (!user.isAdmin()) {
      // IF NOT ADMIN, CHECK IF HAS ASSOCIATION WITH STORE
      const privilegeStoreUpdate = await user.getStores({ where: { id } });
      if (!privilegeStoreUpdate || privilegeStoreUpdate.length === 0) {
        return res
          .status(401)
          .json({ error: 'Você não tem permissão para editar a loja' });
      }
    }

    // URL VALIDATION
    let str = await Store.findOne({ where: { url } });

    if (str && str.id !== Number(id)) {
      return res.status(400).json({ error: 'A URL já existe' });
    }

    // UPDATE
    str = await Store.findByPk(id);
    console.log('AQUIII:', req.body);
    await str.update(req.body);

    if (!str) {
      return res.status(400).json({ error: 'A loja informada não existe' });
    }
    return res.json(str);
  }
}

export default new StoreController();
