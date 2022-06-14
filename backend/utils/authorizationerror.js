const httpStatusCodes = require('./httpstatuscodes');

class AuthorizationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AuthorizationError';
    this.statusCode = httpStatusCodes.UNAUTHORIZED;
  }
}

module.exports = AuthorizationError;
