const mongoose = require('mongoose');

const { Schema } = mongoose;

const productModel = new Schema(
  {
    name: { type: String },
    description: { type: String },
    price: { type: Number }
  }
);

module.exports = mongoose.model('product', productModel);