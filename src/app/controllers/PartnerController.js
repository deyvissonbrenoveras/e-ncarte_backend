import * as Yup from 'yup';
import Partner from '../models/Partner';
import File from '../models/File';
import User from '../models/User';
import Store from '../models/Store';

class PartnerController {
  async index(req, res) {
    const { id } = req.params;
    const partner = await Partner.findByPk(id, {
      attributes: [
        'id',
        'name',
        'site',
        'regionalAgent',
        'agentWhatsapp',
        'sponsorship',
        'facebook',
        'instagram',
      ],
      include: [
        {
          model: File,
          as: 'logo',
          attributes: ['id', 'url', 'path'],
        },
        {
          model: Store,
          as: 'stores',
          attributes: ['id'],
        },
      ],
    });
    // CHECK IF EXISTS
    if (!partner) {
      return res.status(400).json({ error: 'O parceiro informado não existe' });
    }
    return res.json(partner);
  }

  async show(req, res) {
    // NEEDING ADJUST AUTHORIZATION
    const partners = await Partner.findAll({
      include: [
        {
          model: File,
          as: 'logo',
          attributes: ['id', 'url', 'path'],
        },
        {
          model: Store,
          as: 'stores',
          attributes: ['id'],
        },
      ],
    });
    return res.json(partners);
  }

  async store(req, res) {
    // SCHEMA VALIDATION
    const schema = Yup.object().shape({
      logoId: Yup.number().positive().required(),
      name: Yup.string().max(100).required(),
      site: Yup.string().max(2048),
      // agentWhatsapp: Yup.number().test((value) => {
      //   return value ? value.toString().length <= 11 : true;
      // }),
      agentWhatsapp: Yup.number(),
      regionalAgent: Yup.string().max(50),
      whatsapp: Yup.string().max(100),
      facebook: Yup.string().max(100),
      sponsorship: Yup.boolean(),
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'Parceiro/Patrocinador não validado' });
    }

    // CHECK USER PRIVILEGIE
    const user = await User.findByPk(req.userId);
    if (!user.isStoreAdmin()) {
      return res.status(401).json({
        error: 'Você não tem permissão para criar um Parceiro/Patrocinador',
      });
    }

    // CHECK IF PARTNER ALREADY EXISTS
    const { name } = req.body;
    const partnerExists = await Partner.findOne({ where: { name } });
    if (partnerExists) {
      return res
        .status(400)
        .json({ error: 'O Parceiro/Patrocinardor informado já existe' });
    }

    const partner = await Partner.create(req.body);
    return res.json(partner);
  }

  async update(req, res) {
    // SCHEMA VALIDATION
    const schema = Yup.object().shape({
      logoId: Yup.number().positive(),
      name: Yup.string().max(100).required(),
      // agentWhatsapp: Yup.number().test((value) => {
      //   return value ? value.toString().length <= 11 : true;
      // }),
      agentWhatsapp: Yup.number(),
      regionalAgent: Yup.string().max(50),
      sponsorship: Yup.boolean(),
      whatsapp: Yup.string().max(100),
      facebook: Yup.string().max(100),
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'Parceiro/Patrocinador não validado' });
    }

    // CHECK USER PRIVILEGIE
    const user = await User.findByPk(req.userId);
    if (!user.isStoreAdmin()) {
      return res.status(401).json({
        error: 'Você não tem permissão para criar um Parceiro/Patrocinador',
      });
    }

    const { id } = req.params;
    const partner = await Partner.findByPk(id);

    // CHECK IF PARTNER EXISTS
    if (!partner) {
      return res
        .status(400)
        .json({ error: 'O Parceiro/Patrocinador informado não existe' });
    }

    await partner.update(req.body);

    return res.json(partner);
  }
}

export default new PartnerController();
