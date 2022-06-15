const { INTERNAL_SERVER } = require('../utils/httpstatuscodes');

module.exports = (err, req, res, next) => {
  const { statusCode = INTERNAL_SERVER, message } = err;
  res.status(statusCode).send({
    message: statusCode === INTERNAL_SERVER ? 'An error occurred on the server' : message,
  });
};
