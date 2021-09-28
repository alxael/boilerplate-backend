const express = require('express');
const { models } = require('mongoose');
const debug = require('debug')('app:productRouter');

function routes(productModel) {
  const productRouter = express.Router();

  productRouter.route('/product')
    .post((req, res) => {
      const product = new productModel(req.body);
      
      /* POST requirements here */

      if(!(product.name && product.price)) {
        res.status(400);
        return res.send('Invalid entry.');
      }
  
      product.save();
      res.status(201);
      return res.json(product);
    })
    .get((req, res) => {
      const query = {};

      Object.assign(query, req.query);
  
      productModel.find(query, (err, products) => {
        if(err) {
          res.send(err);
        }
  
        const returnProduct = products.map((product) => {
          let newProduct = product.toJSON();
          /* Extra processing */
          return newProduct;
        });
        return res.json(returnProduct);
      });
    });

  productRouter.use('/product/:productId', (req, res, next) => {
    productModel.findById(req.params.productId, (err, product) => {
      if(err) {
        return res.sendStatus(404);
      }
      if(product) {
        req.product = product;
        return next();
      }
      return res.sendStatus(400);
    });
  });

  productRouter.route('/product/:productId')
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