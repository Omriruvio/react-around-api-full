require('dotenv').config();
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { errors } = require('celebrate');
const centralerrhandler = require('./middlewares/centralerrhandler');
const { errorLogger, requestLogger } = require('./middlewares/logger');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const NotFoundError = require('./utils/notfounderror');

const { PORT = 3000, NODE_ENV } = process.env;
const app = express();
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

mongoose.connect('mongodb://0.0.0.0:27017/aroundb');

app.use(limiter);
app.use(cors());
app.options('*', cors());
app.use(express.json());
app.use(helmet());

app.use(requestLogger);

// remove this later
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Server will crash now');
  }, 0);
});

app.use('/', usersRouter, cardsRouter);
app.use('/', (req, res, next) => {
  next(new NotFoundError('Requested resource not found.'));
});

app.use(errorLogger);

app.use(errors());
app.use(centralerrhandler);

if (NODE_ENV !== 'test') app.listen(PORT);
