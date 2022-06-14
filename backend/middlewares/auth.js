const AuthorizationError = require('../utils/authorizationerror');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, NODE_ENV } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new AuthorizationError('No token provided.'));
  }
  const token = authorization.replace('Bearer ', '');

  let payload;
  try {
    console.log(token);
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    next(err);
  }
  req.user = payload;
  next();
};
