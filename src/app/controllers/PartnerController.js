import * as Yup from 'yup';
import Partner from '../models/Partner';
import User from '../models/User';

class PartnerController {
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
