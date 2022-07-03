import State from '../models/State';

class LocationController {
  async showStates(req, res) {
    const states = await State.findAll({ attributes: ['id', 'name', 'uf'] });
    return res.json(states);
  }
}

export default new LocationController();
