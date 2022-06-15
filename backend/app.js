require('dotenv').config();
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');
const centralerrhandler = require('./middlewares/centralerrhandler');
const { errorLogger, requestLogger } = require('./middlewares/logger');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

const { PORT = 3000, NODE_ENV } = process.env;
const app = express();

mongoose.connect('mongodb://0.0.0.0:27017/aroundb');

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
app.use('/', (req, res) => {
  res.status(404).send({ message: 'Requested resource not found' });
});

app.use(errorLogger);

app.use(errors());
app.use(centralerrhandler);

if (NODE_ENV !== 'test') app.listen(PORT);
