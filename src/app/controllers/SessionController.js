import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import * as Yup from 'yup';
import User from '../models/User';

import authConfig from '../../config/auth';

class SessionController {
  async store(req, res) {
    // LOGIN VALIDATION
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().min(8).required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Erro ao validar os dados' });
    }

    // CHECK IF USER EXISTS AND PASSWORD IS CORRECT
    const { email, password } = req.body;

    const user = await User.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(400).json({ error: 'Erro de autenticação' });
    }
    const passwordIsValid = await bcrypt.compare(password, user.passwordHash);

    if (!passwordIsValid) {
      return res.status(400).json({ error: 'Erro de autenticação' });
    }
    // TOKEN GENERATION
    const token = await jwt.sign({ id: user.id }, authConfig.secret, {
      expiresIn: '7d',
    });

    const { id, name, privilege } = user;
    return res.json({
      user: {
        id,
        name,
        email,
        privilege,
      },
      token,
    });
  }
}

export default new SessionController();
