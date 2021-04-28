import * as Yup from 'yup';
import Product from '../models/Product';
import Partner from '../models/Partner';
import User from '../models/User';

class ProductPartnerController {
  async store(req, res) {
    const { productId } = req.params;
    const { partners } = req.body;

    // SCHEMA VALIDATION
    const schema = Yup.object().shape({
      productId: Yup.number().positive().required(),
      partners: Yup.array().of(Yup.number()).required(),
    });
    if (!(await schema.isValid({ productId, partners }))) {
      return res
        .status(400)
        .json({ error: 'Associação Produto - Parceiro não validada' });
    }

    // CHECK USER PRIVILEGIES
    const user = await User.findByPk(req.userId);

    if (!user.isAdmin()) {
      return res.status(401).json({
        error: 'Você não tem permissão para realizar essa alteração',
      });
    }

    // CHECK IF PRODUCT EXISTS
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(400).json({ error: 'O produto informado não existe' });
    }
    const response = await product.addPartners(partners);
    return res.json(response);
  }

  async update(req, res) {
    const { partnerId, productId } = req.query;
    const { partners, products } = req.body;
    // SCHEMA VALIDATION
    const schema = Yup.object().shape({
      productId: Yup.number().positive(),
      partners: Yup.array().when('productId', {
        is: (prodId) => prodId,
        then: Yup.array().of(Yup.number()).required(),
      }),
      partnerId: Yup.number().positive(),
      products: Yup.array().when('partnerId', {
        is: (partId) => partId,
        then: Yup.array().of(Yup.number()).required(),
      }),
    });
    if (!(await schema.isValid({ productId, partners, partnerId, products }))) {
      return res
        .status(400)
        .json({ error: 'Desassociação Produto - Parceiro não validada' });
    }

    if (productId) {
      // CHECK USER PRIVILEGIES
      const user = await User.findByPk(req.userId);

      if (!user.isAdmin()) {
        return res.status(401).json({
          error: 'Você não tem permissão para realizar essa alteração',
        });
      }

      // CHECK IF PRODUCT EXISTS
      const product = await Product.findByPk(productId);
      if (!product) {
        return res
          .status(400)
          .json({ error: 'O produto informado não existe' });
      }
      const response = await product.removePartners(partners);
      return res.json(response);
    }

    if (partnerId) {
      // CHECK USER PRIVILEGIES
      const user = await User.findByPk(req.userId);

      if (!user.isAdmin()) {
        return res.status(401).json({
          error: 'Você não tem permissão para realizar essa alteração',
        });
      }

      // CHECK IF PARTNER EXISTS
      const partner = await Partner.findByPk(partnerId);
      if (!partner) {
        return res
          .status(400)
          .json({ error: 'O parceiro informado não existe' });
      }
      const response = await partner.removeProducts(products);
      return res.json(response);
    }
    return res.json();
  }
}

export default new ProductPartnerController();
