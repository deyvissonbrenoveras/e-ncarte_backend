import Log from '../models/Log';
import User from '../models/User';
import Product from '../models/Product';
import Store from '../models/Store';
const { Op } = require('sequelize');

class LogController {
  async show(req, res) {
    const { startDate, endDate } = req.query;

    const logs = await Log.findAll({
      attributes: ['id', 'oldValue', 'newValue', 'field', 'createdAt'],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'name'],
        },
        {
          model: Store,
          as: 'store',
          attributes: ['id', 'name'],
        },
      ],
      where: {
        createdAt: {
          [Op.between]: [startDate, endDate],
        },
      },
    });
    res.json(logs);
  }
}

export default new LogController();
