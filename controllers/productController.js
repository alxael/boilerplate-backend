const debug = require('debug')('app:productController');

function productController(productModel) {
  function post(req, res) {
    const product = new productModel(req.body);

    /* Insert POST requirements here */

    product.save();
    res.status(201);
    return res.json(product);
  }

  function get(req, res) {
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
  }

  return { post, get };
}

module.exports = productController;