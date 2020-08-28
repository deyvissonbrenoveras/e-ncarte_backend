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

    const user = await User.create({
      ...req.body,
      privilege: Privilege.USER,
    });
    return res.json(user);
  }

  async update(req, res) {
    // SCHEMA VALIDATION
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      oldPassword: Yup.string(),
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

    // CHECK IF EMAIL ALREADY EXISTS
    const { email } = req.body;
    const userCheck = await User.findOne({ where: { email } });
    if (userCheck && userCheck.id !== req.userId) {
      return res.status(400).json({ error: 'O e-mail informado já existe' });
    }

    const user = await User.findByPk(req.userId);
    const { id, name, privilege } = await user.update(req.body);
    return res.json({
      id,
      name,
      email,
      privilege,
    });
  }
}

export default new UserController();
