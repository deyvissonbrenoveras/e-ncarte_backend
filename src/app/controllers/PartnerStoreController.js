import Partner from '../models/Partner';

class PartnerStoreController {
  async store(req, res) {
    const { partnerId } = req.params;
    const partner = await Partner.findByPk(partnerId);
    const response = await partner.addStores(req.body.stores);
    return res.json(response);
  }
}

export default new PartnerStoreController();
