const jwt = require('jsonwebtoken');
const debug = require('debug')('app:authenticate');
const path = require('path');
const userModel = require('../models/userModel');
const userRoleModel = require('../models/userRoleModel');

const verifyToken = (req, res, next) => {
  const token = req.body.token || req.query.token || req.headers.authorization;

  if(!token) {
    res.status(403);
    return res.send('A token is required for authentication.');
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    req.user = decoded;
  } catch(err) {
    res.status(401);
    return res.send('Invalid token.');
  }
  
  return next();
};

const authorizeClient = async (req, res, next) => {
  const user = await userModel.findOne({ token: req.user.token });

  const role = await userRoleModel.findOne(user._doc.role);

  if(role._doc.userRole == 'client' || role._doc.userRole == 'moderator' || role._doc.userRole == 'administrator')
    return next();
  
  res.status('403');
  return res.send('User not authorized.');
}

const authorizeModerator = async (req, res, next) => {
  const user = await userModel.findOne({ token: req.user.token });

  const role = await userRoleModel.findOne(user._doc.role);

  if(role._doc.userRole == 'moderator' || role._doc.userRole == 'administrator')
    return next();
  
  res.status('403');
  return res.send('User not authorized.');
}

const authorizeAdministrator = async (req, res, next) => {
  const user = await userModel.findOne({ token: req.user.token });

  const role = await userRoleModel.findOne(user._doc.role);

  if(role._doc.userRole == 'administrator')
    return next();
  
  res.status('403');
  return res.send('User not authorized.');
}

module.exports = { verifyToken, authorizeClient, authorizeModerator, authorizeAdministrator };