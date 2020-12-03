import * as Yup from 'yup';
import User from '../models/User';

class UserStoreController {
  async store(req, res) {
    // const { userId, storeId } = req.params;

    // // SCHEMA VALIDATION
    // const schema = Yup.object().shape({
    //   userId: Yup.number().positive().required(),
    //   storeId: Yup.number().positive().required(),
    // });

    // if (!(await schema.isValid({ userId, storeId }))) {
    //   return res
    //     .status(400)
    //     .json({ error: 'Associação Usuário - Loja não validada' });
    // }

    // // CHECK USER PRIVILEGES WHEN UPDATING OTHER USER
    // const adminUser = await User.findByPk(req.userId);

    // if (req.userId !== userId) {
    //   if (!adminUser.isAdmin()) {
    //     return res
    //       .status(401)
    //       .json({ error: 'Você não tem permissão para a ação' });
    //   }
    // }

    // // CHECK IF USER EXISTS
    // const userExists = await User.findByPk(userId);

    // if (!userExists) {
    //   return res.status(400).json({ error: 'O usuário informado não existe' });
    // }

    // // CHECK IF STORE EXISTS
    // const storeExists = await Store.findByPk(storeId);

    // if (!storeExists) {
    //   return res.status(400).json({ error: 'A loja informada não existe' });
    // }

    // // CHECK IF ASSOCIATION HAS ALREADY BEEN MADE
    // const userStoreExists = await userExists.getStores({
    //   where: { id: storeId },
    // });
    // if (userStoreExists && userStoreExists.length > 0) {
    //   return res.status(400).json({
    //     error: 'O usuário já tem permissão para fazer alterações na loja',
    //   });
    // }

    // // const userStore = await UserStore.create({ userId, storeId });
    // // return res.json(userStore);

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
