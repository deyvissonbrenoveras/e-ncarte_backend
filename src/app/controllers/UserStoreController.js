import * as Yup from 'yup';
import User from '../models/User';

class UserStoreController {
  async store(req, res) {
    const { userId } = req.params;
    const { stores } = req.body;

    // SCHEMA VALIDATION
    const schema = Yup.object().shape({
      userId: Yup.number().positive().required(),
      stores: Yup.array().of(Yup.number()).required(),
    });

    if (!(await schema.isValid({ userId, stores }))) {
      return res
        .status(400)
        .json({ error: 'Associação Usuário - Loja não validada' });
    }

    // CHECK USER PRIVILEGES WHEN UPDATING OTHER USER
    const adminUser = await User.findByPk(req.userId);

    const storesAllowed = await adminUser.hasStores(stores);

    if (!adminUser.isAdmin() && !storesAllowed) {
      return res.status(401).json({
        error: 'Você não tem permissão para editar uma ou mais lojas',
      });
    }

    // CHECK IF USER EXISTS
    const userExists = await User.findByPk(userId);

    if (!userExists) {
      return res.status(400).json({ error: 'O usuário informado não existe' });
    }

    const response = await userExists.addStores(stores);
    return res.json(response);
  }

  async update(req, res) {
    const { userId } = req.params;
    const { stores } = req.body;

    // SCHEMA VALIDATION
    const schema = Yup.object().shape({
      userId: Yup.number().positive().required(),
      stores: Yup.array().of(Yup.number()).required(),
    });

    if (!(await schema.isValid({ userId, stores }))) {
      return res
        .status(400)
        .json({ error: 'Associação Usuário - Loja não validada' });
    }

    // CHECK USER PRIVILEGES WHEN UPDATING OTHER USER
    const adminUser = await User.findByPk(req.userId);

    const storesAllowed = await adminUser.hasStores(stores);

    if (!adminUser.isAdmin() && !storesAllowed) {
      return res.status(401).json({
        error: 'Você não tem permissão para editar uma ou mais lojas',
      });
    }

    // CHECK IF USER EXISTS
    const userExists = await User.findByPk(userId);

    if (!userExists) {
      return res.status(400).json({ error: 'O usuário informado não existe' });
    }
    const response = await userExists.removeStores(stores);
    return res.json(response);
  }
}

export default new UserStoreController();
