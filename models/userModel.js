const mongoose = require('mongoose');

const { Schema } = mongoose;

const userModel = new Schema(
  {
    username: {
      type: String,
      required: true
    },
    email: { 
      type: String,
      required: true,
      unique: true
    },
    password: { 
      type: String,
      required: true
    },
    role: {
      type: Schema.Types.ObjectId,
      ref: 'userRole'
    },
    token: { 
      type: String 
    }
  }
);

module.exports = mongoose.model('user', userModel);