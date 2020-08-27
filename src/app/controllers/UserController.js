import User from '../models/User';
import Privilege from '../util/PrivilegeEnum';

class UserController {
  async store(req, res) {
    const user = await User.create({
      ...req.body,
      privilege: Privilege.USER,
    });
    return res.json(user);
  }
}

export default new UserController();
