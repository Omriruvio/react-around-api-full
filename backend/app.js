require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const centralerrhandler = require('./middlewares/centralerrhandler');
const { errors } = require('celebrate');
const { errorLogger, requestLogger } = require('./middlewares/logger');
const { PORT = 3000, NODE_ENV } = process.env;
const cors = require('cors');

const app = express();

mongoose.connect('mongodb://0.0.0.0:27017/aroundb');

app.use(cors());
app.options('*', cors());
app.use(express.json());
app.use(helmet());

app.use(requestLogger);

app.use('/', usersRouter, cardsRouter);
app.use('/', (req, res) => {
  res.status(404).send({ message: 'Requested resource not found' });
});

app.use(errorLogger);

app.use(errors());
app.use(centralerrhandler);

NODE_ENV !== 'test' && app.listen(PORT);
