const jwt = require('jsonwebtoken');
const debug = require('debug')('app:authenticate');

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

module.exports = verifyToken;