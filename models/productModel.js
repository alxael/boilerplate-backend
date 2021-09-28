const mongoose = require('mongoose');

const { Schema } = mongoose;

const productModel = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true }
  }
);

module.exports = mongoose.model('product', productModel);