import jwt from 'jsonwebtoken';
import authConfig from '../../config/auth';

export default async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const validated = await jwt.verify(token, authConfig.secret);
    req.userId = validated.id;
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};
