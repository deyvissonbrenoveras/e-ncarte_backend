import * as Yup from 'yup';

import Store from '../models/Store';
import File from '../models/File';
import User from '../models/User';

class StoreController {
  async index(req, res) {
    const { id } = req.params;
    const str = await Store.findByPk(id, {
      include: [
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
          model: User,
          as: 'admins',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });
    return res.json(str);
  }

  async show(req, res) {
    const user = await User.findByPk(req.userId);
    let stores;

    // DETERMINING WHICH STORES WILL BE RETURNED UNDER THE USER PRIVILEGE
    if (user.isAdmin()) {
      stores = await Store.findAll({
        include: [
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
        ],
      });
    } else if (user.isStoreAdmin()) {
      stores = await user.getStores();
    }

    return res.json(stores);
  }

  async store(req, res) {
    // SCHEMA VALIDATION
    const schema = Yup.object().shape({
      logoId: Yup.number(),
      coverId: Yup.number(),
      name: Yup.string().max(50).required(),
      url: Yup.string().max(50).required(),
      address: Yup.string().max(100),
      city: Yup.string().max(100),
      phone: Yup.string().max(100),
      whatsapp: Yup.string().max(100),
      facebook: Yup.string().max(100),
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
      city,
      phone,
      whatsapp,
      instagram,
      facebook,
    } = await Store.create(req.body);

    return res.json({
      name,
      address,
      city,
      phone,
      whatsapp,
      instagram,
      facebook,
    });
  }

  async update(req, res) {
    const { userId } = req;
    const { id } = req.params;
    const { url } = req.body;

    // SCHEMA VALIDATION
    const schema = Yup.object().shape({
      logoId: Yup.number(),
      coverId: Yup.number(),
      name: Yup.string().max(50).required(),
      url: Yup.string().max(50).required(),
      address: Yup.string().max(100),
      city: Yup.string().max(100),
      phone: Yup.string().max(100),
      whatsapp: Yup.string().max(100),
      facebook: Yup.string().max(100),
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
    await str.update(req.body);

    return res.json(str);
  }
}

export default new StoreController();
