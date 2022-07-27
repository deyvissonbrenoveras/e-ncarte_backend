import City from '../models/City';
import State from '../models/State';
import Store from '../models/Store';

class LocationController {
  async showStates(req, res) {
    const states = await State.findAll({ attributes: ['id', 'name', 'uf'] });
    return res.json(states);
  }

  async showCities(req, res) {
    const { state } = req.query;
    let where = {};

    if (state) {
      const foundState = await State.findOne({
        where: { uf: state.toUpperCase() },
      });

      if (!foundState) {
        return res.status(400).json({ error: 'O estado informado não existe' });
      }
      where = { stateId: foundState.id };
    }

    const cities = await City.findAll({
      where,
      attributes: ['id', 'name', 'stateId'],
      include: [
        {
          model: State,
          as: 'state',
          attributes: ['id', 'name', 'uf'],
        },
      ],
    });
    return res.json(cities);
  }
  async showActiveCities(req, res) {
    const cities = await Store.findAll({
      attributes: ['cityId'],
      group: ['cityId', 'city.id', 'city.state.id'],
      include: [
        {
          model: City,
          as: 'city',
          attributes: ['id', 'name'],
          include: [
            {
              model: State,
              as: 'state',
              attributes: ['id', 'name', 'uf'],
            },
          ],
        },
      ],
      where: { active: true },
    });
    return res.json(cities);
  }
}

export default new LocationController();
