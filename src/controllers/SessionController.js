class SessionController {
  async store(req, res) {
    return res.json({ message: 'foi' });
  }
}

export default new SessionController();
