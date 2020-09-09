import * as Yup from 'yup';
import Partner from '../models/Partner';
import User from '../models/User';

class PartnerStoreController {
  async store(req, res) {
    const { partnerId } = req.params;
    const { stores } = req.body;

    // SCHEMA VALIDATION
    const schema = Yup.object().shape({
      partnerId: Yup.number().positive().required(),
      stores: Yup.array().of(Yup.number()).required(),
    });
    if (!(await schema.isValid({ partnerId, stores }))) {
      return res
        .status(400)
        .json({ error: 'Associação Parceiro - Loja não validada' });
    }

    // CHECK USER PRIVILEGIES
    const user = await User.findByPk(req.userId);

    const storesAllowed = await user.hasStores(stores);

    if (!user.isAdmin() && !storesAllowed) {
      return res.status(401).json({
        error: 'Você não tem permissão para editar uma ou mais lojas',
      });
    }

    // CHECK IF PARTNER EXISTS
    const partner = await Partner.findByPk(partnerId);
    if (!partner) {
      return res
        .status(400)
        .json({ error: 'O parceiro/patrocinador informado não existe' });
    }

    const response = await partner.addStores(req.body.stores);
    return res.json(response);
  }

  async delete(req, res) {
    const { partnerId } = req.params;
    const { stores } = req.body;

    // SCHEMA VALIDATION
    const schema = Yup.object().shape({
      partnerId: Yup.number().positive().required(),
      stores: Yup.array().of(Yup.number()).required(),
    });
    if (!(await schema.isValid({ partnerId, stores }))) {
      return res
        .status(400)
        .json({ error: 'Desassociação Parceiro - Loja não validada' });
    }

    // CHECK USER PRIVILEGIES
    const user = await User.findByPk(req.userId);

    const storesAllowed = await user.hasStores(stores);

    if (!user.isAdmin() && !storesAllowed) {
      return res.status(401).json({
        error: 'Você não tem permissão para editar uma ou mais lojas',
      });
    }

    // CHECK IF PARTNER EXISTS
    const partner = await Partner.findByPk(partnerId);
    if (!partner) {
      return res
        .status(400)
        .json({ error: 'O parceiro/patrocinador informado não existe' });
    }

    const response = await partner.removeStores(req.body.stores);
    return res.json(response);
  }
}

export default new PartnerStoreController();
