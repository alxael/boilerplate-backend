const express = require('express');
const { models } = require('mongoose');
const path = require('path');
const debug = require('debug')('app:productRouter');
const productController = require(path.join(__dirname, '../controllers/productController'));

function routes(productModel) {
  const productRouter = express.Router();
  const controller = productController(productModel)

  productRouter.route('/products')
    .post(controller.post)
    .get(controller.get);

  productRouter.use('/products/:productId', (req, res, next) => {
    productModel.findById(req.params.productId, (err, product) => {
      if(err) {
        return res.sendStatus(404);
      }
      if(product) {
        req.product = product;
        return next();
      }
      return res.sendStatus(400);
    })
  });

  productRouter.route('/products/:productId')
    .get((req, res) => {
      const returnProduct = req.product.toJSON();
      res.json(returnProduct);
    })
    .put((req, res) => {
      const { product } = req;

      Object.assign(product, req.body);

      req.product.save((err) => {
        if(err) {
          return res.send(err);
        }
        return res.json(product);
      })
    })
    .patch((req, res) => {
      const { product } = req;

      if(req.body._id) {
        delete req.body._id;
      }
      Object.entries(req.body).forEach((item) => {
        const key = item[0];
        const value = item[1];
        product[key] = value;
      });

      req.product.save((err) => {
        if(err) {
          return res.send(err);
        }
        return res.json(product);
      });
    })
    .delete((req, res) => {
      req.product.remove((err) => {
        if(err) {
          return res.send(err);
        }
        return res.sendStatus(204);
      })
    });

  return productRouter;
}

module.exports = routes;