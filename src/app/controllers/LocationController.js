import City from '../models/City';
import State from '../models/State';

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
}

export default new LocationController();
