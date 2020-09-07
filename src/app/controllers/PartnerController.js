import * as Yup from 'yup';
import Partner from '../models/Partner';
import User from '../models/User';

class PartnerController {
  async store(req, res) {
    // SCHEMA VALIDATION
    const schema = Yup.object().shape({
      logoId: Yup.number().positive().required(),
      name: Yup.string().required(),
      whatsapp: Yup.string().notRequired(),
      sponsorship: Yup.boolean().notRequired(),
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
}

export default new PartnerController();
