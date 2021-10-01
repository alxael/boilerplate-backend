const jwt = require('jsonwebtoken');
const debug = require('debug')('app:authenticate');
const path = require('path');
const userModel = require('../models/userModel');
const userRoleModel = require('../models/userRoleModel');

const verifyToken = async (req, res, next) => {
  const token = req.body.token || req.query.token || req.headers.authorization;

  if(!token) {
    res.status(403);
    return res.send('A token is required for authentication.');
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    const user = await userModel.findOne({ email: decoded.email });
    
    if(!user) {
      res.status(404);
      return res.send('User not found.');
    }

    req.user = user;
    return next();
  } catch(err) {
    res.status(401);
    return res.send('Invalid token.');
  }
  
  return next();
};

const authorizeClient = async (req, res, next) => {
  const user = await userModel.findOne({ email: req.user._doc.email });

  const role = await userRoleModel.findOne({ _id: user._doc.role._id });

  if(role._doc.userRole == 'client' || role._doc.userRole == 'moderator' || role._doc.userRole == 'administrator')
    return next();
  
  res.status('403');
  return res.send('User not authorized.');
}

const authorizeModerator = async (req, res, next) => {
  const user = await userModel.findOne({ email: req.user.email });

  const role = await userRoleModel.findOne({ _id: user._doc.role._id });

  if(role._doc.userRole == 'moderator' || role._doc.userRole == 'administrator')
    return next();
  
  res.status('403');
  return res.send('User not authorized.');
}

const authorizeAdministrator = async (req, res, next) => {
  const user = await userModel.findOne({ email: req.user.email });

  const role = await userRoleModel.findOne({ _id: user._doc.role._id });

  if(role._doc.userRole == 'administrator')
    return next();
  
  res.status('403');
  return res.send('User not authorized.');
}

module.exports = { verifyToken, authorizeClient, authorizeModerator, authorizeAdministrator };