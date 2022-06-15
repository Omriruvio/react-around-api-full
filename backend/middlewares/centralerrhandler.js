const { INTERNAL_SERVER } = require('../utils/httpstatuscodes');

module.exports = (err, req, res, next) => {
  console.log('caught by central err handler\n', err);

  const { statusCode = INTERNAL_SERVER, message } = err;
  res.status(statusCode).send({
    message: statusCode === INTERNAL_SERVER ? 'An error occurred on the server' : message,
  });
};
