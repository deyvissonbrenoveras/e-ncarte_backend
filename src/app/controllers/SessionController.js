import User from '../models/User';

class SessionController {
  async store(req, res) {
    const { email } = req.body;

    const user = await User.findOne({
      where: {
        email,
      },
    });
    return res.json(user);
  }
}

export default new SessionController();
