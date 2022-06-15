const AuthorizationError = require('../utils/authorizationerror');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, NODE_ENV } = process.env;
const { FORBIDDEN } = require('../utils/httpstatuscodes');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new AuthorizationError('No token provided.', FORBIDDEN));
    return;
  }

  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    next(new AuthorizationError('Invalid token provided.', FORBIDDEN));
  }
  req.user = payload;
  next();
};
