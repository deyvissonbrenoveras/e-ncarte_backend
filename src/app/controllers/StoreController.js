import * as Yup from 'yup';

import Store from '../models/Store';
import File from '../models/File';

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
      ],
    });
    return res.json(str);
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
