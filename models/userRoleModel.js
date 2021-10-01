const mongoose = require('mongoose');

const { Schema } = mongoose;

const userRoleModel = new Schema(
  {
    userRole: {
      type: String,
      required: true
    }
  }
);

module.exports = mongoose.model('userRole', userRoleModel);