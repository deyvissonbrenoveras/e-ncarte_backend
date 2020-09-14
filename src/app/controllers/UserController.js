import * as Yup from 'yup';
import User from '../models/User';
import Privilege from '../util/PrivilegeEnum';

class UserController {
  async store(req, res) {
    // SCHEMA VALIDATION
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().min(8).required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Erro ao validar os dados' });
    }

    // CHECK IF E-MAIL EXISTS
    const { email } = req.body;
    const userExists = await User.findOne({ where: { email } });

    if (userExists) {
      return res.status(400).json({ error: 'O e-mail informado já existe' });
    }

    const { id, name, privilege } = await User.create({
      ...req.body,
      privilege: Privilege.USER,
    });
    return res.json({ id, name, email, privilege });
  }

  async update(req, res) {
    const id = Number(req.params.id);
    // SCHEMA VALIDATION
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      oldPassword: Yup.string(),
      privilege: Yup.number(),
      password: Yup.string()
        .min(8)
        .when('oldPassword', (oldPassword, field) => {
          return oldPassword ? field.required() : Yup.string();
        }),
      confirmPassword: Yup.string().when('password', (password, field) => {
        return password ? field.required().oneOf([Yup.ref('password')]) : field;
      }),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Erro ao validar os dados' });
    }

    // CHECK IF USER EXISTS
    const userToUpdate = await User.findByPk(id);
    if (!userToUpdate) {
      return res.status(400).json({ error: 'Usuário não encontrado' });
    }

    const adminUser = await User.findByPk(req.userId);

    // CHECK USER PRIVILEGES WHEN UPDATING OTHER USER
    if (req.userId !== id) {
      if (!adminUser.isAdmin()) {
        return res
          .status(401)
          .json({ error: 'Você não tem permissão para a ação' });
      }
    }

    // CHECK USER PRIVILEGES WHEN UPDATE PRIVILEGE
    const privilege = Number(req.body.privilege);

    if (privilege !== Privilege.USER) {
      if (!adminUser.isRoot()) {
        return res
          .status(401)
          .json({ error: 'Você não tem permissão para a ação' });
      }
    }

    // CHECK IF EMAIL ALREADY EXISTS
    const { email } = req.body;
    const userCheck = await User.findOne({ where: { email } });
    if (userCheck && userCheck.id !== id) {
      return res.status(400).json({ error: 'O e-mail informado já existe' });
    }

    const { name } = await userToUpdate.update(req.body);
    return res.json({
      id,
      name,
      email,
      privilege,
    });
  }
}

export default new UserController();
